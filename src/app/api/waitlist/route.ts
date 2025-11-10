import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

type WaitlistRequestBody = {
  name?: string;
  email?: string;
  agreeToEmails?: boolean;
};

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  [key: string]: unknown;
};

type GoogleApiError = {
  message?: string;
  code?: number;
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
      };
    };
  };
};

const SERVICE_ACCOUNT_CREDENTIALS: ServiceAccountCredentials = {
  client_email: 'YOUR_SERVICE_ACCOUNT_EMAIL',
  private_key: `-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_GOES_HERE
-----END PRIVATE KEY-----`,
};

const GOOGLE_SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

const PLACEHOLDER_TOKENS = ['YOUR_SERVICE_ACCOUNT_EMAIL', 'YOUR_PRIVATE_KEY_GOES_HERE', 'YOUR_GOOGLE_SHEET_ID'];

const isGoogleApiError = (error: unknown): error is GoogleApiError => {
  return typeof error === 'object' && error !== null;
};

const formatTimestamp = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const hasPlaceholders = (): boolean => {
  const serializedCredentials = JSON.stringify(SERVICE_ACCOUNT_CREDENTIALS);
  return PLACEHOLDER_TOKENS.some((token) => serializedCredentials.includes(token) || GOOGLE_SHEET_ID.includes(token));
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WaitlistRequestBody | null;
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const agreeToEmails = Boolean(body?.agreeToEmails);

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (hasPlaceholders()) {
      console.error('Hard-coded Google credentials contain placeholder values.');
      return NextResponse.json(
        { error: 'Server configuration error: Google credentials are not configured. Update SERVICE_ACCOUNT_CREDENTIALS and GOOGLE_SHEET_ID in the code before deploying.' },
        { status: 500 }
      );
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Log the service account email for verification
    const serviceAccountEmail = SERVICE_ACCOUNT_CREDENTIALS.client_email;
    console.log('Authenticating with service account:', serviceAccountEmail);

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the current date/time in a human-readable format
    const timestamp = formatTimestamp(new Date());

    // Get the first sheet name (in case it's not "Sheet1")
    let sheetName = 'Sheet1';
    try {
      const sheetMetadata = await sheets.spreadsheets.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        fields: 'sheets.properties.title',
      });
      if (sheetMetadata.data.sheets && sheetMetadata.data.sheets.length > 0) {
        sheetName = sheetMetadata.data.sheets[0].properties?.title || 'Sheet1';
      }
    } catch (metadataError) {
      console.warn('Could not fetch sheet metadata, using default "Sheet1":', metadataError);
    }

    // Append the data to the sheet
    // Assuming the sheet has headers: Timestamp, Name, Email, Agree to Emails
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `${sheetName}!A:D`, // Use the actual sheet name
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[timestamp, name, email, agreeToEmails ? 'Yes' : 'No']],
        },
      });

      return NextResponse.json(
        { success: true, message: 'Successfully added to waitlist' },
        { status: 200 }
      );
    } catch (sheetsError: unknown) {
      console.error('Google Sheets API error:', sheetsError);

      if (isGoogleApiError(sheetsError)) {
        console.error('Error details:', {
          code: sheetsError.code,
          message: sheetsError.message,
          response: sheetsError.response?.data,
          status: sheetsError.response?.status,
        });

        // Handle specific Google Sheets API errors
        if (sheetsError.code === 403 || sheetsError.response?.status === 403) {
          const errorDetails = sheetsError.response?.data?.error?.message || sheetsError.message || 'Unknown permission error';
          return NextResponse.json(
            { 
              error: `Permission denied. Please make sure the Google Sheet is shared with the service account email: ${serviceAccountEmail} with Editor permissions.`,
              details: errorDetails,
              serviceAccountEmail: serviceAccountEmail,
              spreadsheetId: GOOGLE_SHEET_ID,
            },
            { status: 403 }
          );
        }

        if (sheetsError.code === 404 || sheetsError.response?.status === 404) {
          return NextResponse.json(
            { error: 'Google Sheet not found. Please check that the GOOGLE_SHEET_ID configured in the code is correct.' },
            { status: 404 }
          );
        }

        if (sheetsError.message) {
          return NextResponse.json(
            { error: `Google Sheets error: ${sheetsError.message}. Please check the server logs for more details.` },
            { status: 500 }
          );
        }
      }

      throw sheetsError; // Re-throw if we can't handle it specifically
    }
  } catch (error: unknown) {
    console.error('Error adding to waitlist:', error);
    
    // Return a more helpful error message
    if (isGoogleApiError(error) && error.message) {
      return NextResponse.json(
        { error: `Failed to add to waitlist: ${error.message}. Please check the server configuration and try again.` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add to waitlist due to an unexpected error. Please check the server configuration and try again.' },
      { status: 500 }
    );
  }
}


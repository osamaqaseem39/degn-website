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

const validateCredentials = (credentials: ServiceAccountCredentials | null, spreadsheetId: string | undefined) => {
  if (!credentials) {
    return 'GOOGLE_SERVICE_ACCOUNT_KEY is missing or invalid.';
  }
  if (!credentials.client_email || !credentials.private_key) {
    return 'GOOGLE_SERVICE_ACCOUNT_KEY must include client_email and private_key.';
  }
  if (!spreadsheetId || spreadsheetId === 'YOUR_GOOGLE_SHEET_ID') {
    return 'GOOGLE_SHEET_ID is missing or still set to the placeholder value.';
  }
  return null;
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

    // Load service account credentials from environment
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    let credentials: ServiceAccountCredentials | null = null;
    if (serviceAccountKey) {
      try {
        credentials = JSON.parse(serviceAccountKey) as ServiceAccountCredentials;
      } catch (parseError) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', parseError);
        return NextResponse.json(
          { error: 'Server configuration error: GOOGLE_SERVICE_ACCOUNT_KEY must be valid JSON.' },
          { status: 500 }
        );
      }
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const configError = validateCredentials(credentials, spreadsheetId);
    if (configError) {
      console.error(configError);
      return NextResponse.json(
        { error: `Server configuration error: ${configError}` },
        { status: 500 }
      );
    }

    const resolvedCredentials = credentials as ServiceAccountCredentials;
    const resolvedSpreadsheetId = spreadsheetId as string;

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: resolvedCredentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Log the service account email for verification
    const serviceAccountEmail = resolvedCredentials.client_email;
    console.log('Authenticating with service account:', serviceAccountEmail);

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the current date/time in a human-readable format
    const timestamp = formatTimestamp(new Date());

    // Get the first sheet name (in case it's not "Sheet1")
    let sheetName = 'Sheet1';
    try {
      const sheetMetadata = await sheets.spreadsheets.get({
        spreadsheetId: resolvedSpreadsheetId,
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
        spreadsheetId: resolvedSpreadsheetId,
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
              spreadsheetId: resolvedSpreadsheetId,
            },
            { status: 403 }
          );
        }

        if (sheetsError.code === 404 || sheetsError.response?.status === 404) {
          return NextResponse.json(
            { error: 'Google Sheet not found. Please check that the GOOGLE_SHEET_ID is correct.' },
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


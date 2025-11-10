# Google Sheets Integration Setup

This guide will help you set up the Google Sheets integration for the waitlist form.

## Prerequisites

1. A Google Sheet where you want to store the waitlist data
2. A Google Cloud project with Sheets API enabled
3. A service account JSON file downloaded from Google Cloud

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Degn Waitlist"
4. Add headers in the first row: `Timestamp`, `Name`, `Email`, `Agree to Emails`
5. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

## Step 2: Share the Sheet with the Service Account

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. Add the service account email from your JSON file (it looks like `your-service-account@project-id.iam.gserviceaccount.com`)
4. Give it "Editor" permissions
5. Click "Send"

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following:

```env
# Google Service Account Key (JSON as a single-line string)
# Convert your downloaded service-account.json to a single line (escape line breaks with \n)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_DATA\\n-----END PRIVATE KEY-----\\n","client_email":"your-service-account@project-id.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project-id.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

# Google Sheet ID (from the URL of your Google Sheet)
GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID
```

**Important:** Replace `your-google-sheet-id-here` with your actual Google Sheet ID.

## Step 4: Restart Your Development Server

After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
```

## Testing

1. Fill out the waitlist form on your website
2. Submit the form
3. Check your Google Sheet - you should see the new entry with timestamp, name, email, and agreement status

## Troubleshooting

- **"Server configuration error"**: Make sure your `.env.local` file exists and has the correct format
- **"Failed to add to waitlist"**: Check that you've shared the Google Sheet with the service account email
- **Sheet not updating**: Verify the Sheet ID is correct in your `.env.local` file


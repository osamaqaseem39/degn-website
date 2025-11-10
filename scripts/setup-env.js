const fs = require('fs');
const path = require('path');

// Read the service account JSON file
const jsonPath = path.join(__dirname, '..', 'service-account.json');
const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(jsonPath)) {
  console.error('Error: service-account.json not found in project root');
  console.log('Please copy your service account JSON file to the project root as "service-account.json"');
  process.exit(1);
}

try {
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const jsonData = JSON.parse(jsonContent);
  
  // Convert to single-line string
  const jsonString = JSON.stringify(jsonData);
  
  // Read existing .env.local or create new content
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add GOOGLE_SERVICE_ACCOUNT_KEY
  if (envContent.includes('GOOGLE_SERVICE_ACCOUNT_KEY=')) {
    envContent = envContent.replace(
      /GOOGLE_SERVICE_ACCOUNT_KEY=.*/,
      `GOOGLE_SERVICE_ACCOUNT_KEY=${jsonString}`
    );
  } else {
    envContent += `\nGOOGLE_SERVICE_ACCOUNT_KEY=${jsonString}\n`;
  }
  
  // Add GOOGLE_SHEET_ID if not present
  if (!envContent.includes('GOOGLE_SHEET_ID=')) {
    envContent += 'GOOGLE_SHEET_ID=your-google-sheet-id-here\n';
  }
  
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log('✅ Successfully updated .env.local with service account credentials');
  console.log('⚠️  Don\'t forget to:');
  console.log('   1. Create a Google Sheet and share it with: degn-waitlist@durable-student-477510-k8.iam.gserviceaccount.com');
  console.log('   2. Update GOOGLE_SHEET_ID in .env.local with your Sheet ID');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}


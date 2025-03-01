# Import Firestore Script

This script allows you to import data into Firestore from a JSON file. Below are the steps to use the script with `teamMembers.json` as an example.

## Prerequisites

1. Ensure you have Node.js installed.
2. Add your Firebase `serviceAccountKey.json` file to the project root.

## Steps

1. Install the necessary dependencies:

   ```sh
   npm install
   ```

2. Place your `serviceAccountKey.json` file in the project root. This file can be obtained from your Firebase project settings under the "Service accounts" tab.

3. While in the scripts director, run the import script with the `teamMembers.json` file:
   ```sh
   node importFirestore.js ./imported_collections/teamMembers.json
   ```

This will import the data from `teamMembers.json` into your Firestore database.

## Example `serviceAccountKey.json`

Here is an example structure of the `serviceAccountKey.json` file:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-client-cert-url"
}
```

Ensure that your `serviceAccountKey.json` file matches this structure with your Firebase project details.

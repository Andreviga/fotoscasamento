import { google } from 'googleapis';

function getDriveAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON não configurado.');
  }

  const credentials = JSON.parse(raw);

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
}

export async function uploadUrlToDrive(fileUrl: string, fileName: string) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID não configurado.');
  }

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error('Falha ao descarregar imagem do Cloudinary.');
  }

  const arrayBuffer = await response.arrayBuffer();
  const auth = getDriveAuth();
  const drive = google.drive({ version: 'v3', auth });

  const result = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId]
    },
    media: {
      mimeType: 'image/jpeg',
      body: Buffer.from(arrayBuffer)
    },
    fields: 'id,name,webViewLink'
  });

  return result.data;
}

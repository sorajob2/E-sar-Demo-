require("dotenv").config();

const { google } = require("googleapis");
const fs = require("fs");

// =====================================
// OAuth2
// =====================================

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// =====================================
// Find Folder
// =====================================

async function findFolder(name, parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents
        and mimeType='application/vnd.google-apps.folder'
        and name='${name}'
        and trashed=false`,
    fields: "files(id,name)",
  });

  if (res.data.files.length > 0) {
    return res.data.files[0];
  }

  return null;
}

// =====================================
// Create Folder
// =====================================

async function createFolder(name, parentId) {
  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id,name",
  });

  console.log("Create Folder :", folder.data.name);

  return folder.data;
}

// =====================================
// Get Or Create Folder
// =====================================

async function getOrCreateFolder(name, parentId) {
  let folder = await findFolder(name, parentId);

  if (!folder) {
    folder = await createFolder(name, parentId);
  } else {
    console.log("Found Folder :", folder.name);
  }

  return folder.id;
}

// =====================================
// Evidence Folder
// Evidence
//   └──2571
//       └──KPI001
// =====================================

async function getEvidenceFolder(year, kpiCode) {
  const yearFolderId = await getOrCreateFolder(
    year.toString(),
    process.env.GOOGLE_DRIVE_FOLDER_ID
  );

  const kpiFolderId = await getOrCreateFolder(
    kpiCode,
    yearFolderId
  );

  return kpiFolderId;
}

// =====================================
// Upload File
// =====================================

async function uploadFile(file, year, kpiCode) {

  const folderId = await getEvidenceFolder(
    year,
    kpiCode
  );

  const fileName =
    `${Date.now()}_${file.originalname}`;

  console.log({
    folderId,
    fileName
  });

  const uploaded = await drive.files.create({

    requestBody: {
      name: fileName,
      parents: [folderId],
    },

    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    },

    fields: "id,name,webViewLink",

  });

  // แชร์ให้อ่านได้ (ถ้าต้องการ)
  await drive.permissions.create({

    fileId: uploaded.data.id,

    requestBody: {
      role: "reader",
      type: "anyone",
    },

  });

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  return {

    id: uploaded.data.id,

    name: uploaded.data.name,

    view:
      uploaded.data.webViewLink ||
      getDriveLink(uploaded.data.id),

  };

}

// =====================================
// Delete File
// =====================================

async function deleteFile(fileId) {

  await drive.files.delete({

    fileId,

  });

}

// =====================================
// Drive Link
// =====================================

function getDriveLink(fileId) {

  return `https://drive.google.com/file/d/${fileId}/view`;

}

module.exports = {

  drive,

  findFolder,

  createFolder,

  getOrCreateFolder,

  getEvidenceFolder,

  uploadFile,

  deleteFile,

  getDriveLink,

};
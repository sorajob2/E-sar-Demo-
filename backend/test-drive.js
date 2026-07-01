require("dotenv").config();

const {
    getOrCreateFolder
} = require("./services/googleDrive.service");

(async () => {

    const evidenceId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const yearId = await getOrCreateFolder("2569", evidenceId);

    console.log(yearId);

})();
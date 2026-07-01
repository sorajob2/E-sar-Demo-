// test-upload.js

require("dotenv").config();

const path = require("path");

const {

    getEvidenceFolder,

    uploadFile,

    getDriveLink

}=require("./services/googleDrive.service");

(async()=>{

    const folder=await getEvidenceFolder(

        2569,

        "KPI200"

    );

    const file=await uploadFile(

        path.join(__dirname,"sample.pdf"),

        "sample.pdf",

        folder

    );

    console.log(file);

    console.log(getDriveLink(file.id));

})();
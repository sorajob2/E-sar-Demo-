// test-drive2.js

require("dotenv").config();

const {

    getEvidenceFolder

} = require("./services/googleDrive.service");

(async()=>{

    const folder = await getEvidenceFolder(

        2569,

        "KPI200"

    );

    console.log(folder);

})();
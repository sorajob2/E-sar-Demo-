const bcrypt = require("bcrypt");

const hash = bcrypt.hashSync("staff2", 10);

console.log(hash);
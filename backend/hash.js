const bcrypt = require("bcryptjs");

const hash = bcrypt.hashSync("staff2", 10);

console.log(hash);
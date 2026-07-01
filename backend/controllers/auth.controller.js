const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.login = async (req, res) => {

    const { username, password } = req.body;

    const [rows] = await db.query(
        `
SELECT
    u.user_id,
    u.username,
    u.password_hash,
    u.full_name,
    u.is_active,
    r.role_name
FROM user u
JOIN role r
    ON u.role_id = r.role_id
WHERE u.username = ?
`,
        [username]
    );

    if (rows.length === 0) {
        return res.status(401).json({
            message: "User not found"
        });
    }

    const user = rows[0];
    if(user.is_active == 0){

  return res.status(401).json({
    message: 'บัญชีถูกปิดใช้งาน'
  });

}

    const validPassword = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            role: user.role_name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.json({
    token,
    user:{
        user_id:user.user_id,
        full_name:user.full_name,
        role:user.role_name
    }
});
};
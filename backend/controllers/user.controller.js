const db = require('../config/db');

exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        u.user_id,
        u.username,
        u.full_name,
        u.email,
        u.is_active,
        r.role_name
      FROM user u
      JOIN role r
        ON u.role_id = r.role_id
      ORDER BY u.user_id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getStaffs = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        u.user_id,
        u.full_name
      FROM user u
      JOIN role r
        ON u.role_id = r.role_id
      WHERE r.role_name = 'STAFF'
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};


const bcrypt = require('bcryptjs');

exports.create = async (req, res) => {

  const {
    username,
    password,
    full_name,
    email,
    role_id
  } = req.body;

  const password_hash =
    await bcrypt.hash(password, 10);

  await db.query(
    `
    INSERT INTO user
    (
      role_id,
      username,
      password_hash,
      full_name,
      email,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, 1)
    `,
    [
      role_id,
      username,
      password_hash,
      full_name,
      email
    ]
  );

  res.json({
    success: true
  });

};

exports.getById = async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM user
    WHERE user_id = ?
    `,
    [req.params.id]
  );

  if(rows.length === 0){

    return res.status(404).json({
      message:'User not found'
    });

  }

  res.json(rows[0]);

};

exports.update = async (req, res) => {

  const bcrypt = require('bcryptjs');

  const {
    username,
    password,
    full_name,
    email,
    role_id,
    is_active
  } = req.body;

  if (password && password.trim() !== '') {

    const password_hash =
      await bcrypt.hash(password, 10);

    await db.query(
      `
      UPDATE user
      SET
        username = ?,
        password_hash = ?,
        full_name = ?,
        email = ?,
        role_id = ?,
        is_active = ?
      WHERE user_id = ?
      `,
      [
        username,
        password_hash,
        full_name,
        email,
        role_id,
        is_active,
        req.params.id
      ]
    );

  } else {

    await db.query(
      `
      UPDATE user
      SET
        username = ?,
        full_name = ?,
        email = ?,
        role_id = ?,
        is_active = ?
      WHERE user_id = ?
      `,
      [
        username,
        full_name,
        email,
        role_id,
        is_active,
        req.params.id
      ]
    );

  }

  res.json({
    success: true
  });

};
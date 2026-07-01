const db = require('../config/db');

exports.getByIndicator = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
  SELECT
  t.target_id,
  t.indicator_id,
  t.year_id,
  t.target_value,
  f.year_name
  FROM indicator_target t
  JOIN fiscal_year f
    ON t.year_id = f.year_id
  WHERE t.indicator_id = ?
  `,
      [req.params.indicatorId]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.create = async (req, res) => {

  try {
    console.log('BODY = ', req.body);
    const {
      indicator_id,
      year_id,
      target_value
    } = req.body;

    // ตรวจสอบว่าปีนี้มี Target แล้วหรือยัง
    const [exists] = await db.query(
      `
      SELECT *
      FROM indicator_target
      WHERE indicator_id = ?
      AND year_id = ?
      `,
      [indicator_id, year_id]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        message: 'ปีงบประมาณนี้มี Target แล้ว'
      });
    }

    // บันทึกข้อมูล
    await db.query(
      `
      INSERT INTO indicator_target
      (
        indicator_id,
        year_id,
        target_value,
        created_by
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        indicator_id,
        year_id,
        target_value,
        req.user.user_id
      ]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error('TARGET ERROR = ', error);
    res.status(500).json(error);

  }

};

exports.delete = async (req, res) => {

  try {

    await db.query(
      `
      DELETE FROM indicator_target
      WHERE target_id = ?
      `,
      [req.params.id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json(error);

  }



};

exports.getById = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM indicator_target
      WHERE target_id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Target not found'
      });
    }

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.update = async (req, res) => {

  try {

    const {
      year_id,
      target_value
    } = req.body;

    await db.query(
      `
      UPDATE indicator_target
      SET
        year_id = ?,
        target_value = ?
      WHERE target_id = ?
      `,
      [
        year_id,
        target_value,
        req.params.id
      ]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json(error);

  }

};
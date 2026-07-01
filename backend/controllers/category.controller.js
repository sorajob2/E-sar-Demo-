const db = require('../config/db');

exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        c.*,
        s.strategy_name
      FROM indicator_category c
      JOIN strategy s
      ON c.strategy_id = s.strategy_id
      ORDER BY c.category_id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.create = async (req, res) => {

  try {

    const {
      strategy_id,
      category_name,
      description
    } = req.body;

    await db.query(`
      INSERT INTO indicator_category
      (
        strategy_id,
        category_name,
        description
      )
      VALUES (?, ?, ?)
    `,
    [
      strategy_id,
      category_name,
      description
    ]);

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.update = async (req, res) => {

  try {

    const {
      strategy_id,
      category_name,
      description
    } = req.body;

    await db.query(`
      UPDATE indicator_category
      SET
        strategy_id = ?,
        category_name = ?,
        description = ?
      WHERE category_id = ?
    `,
    [
      strategy_id,
      category_name,
      description,
      req.params.id
    ]);

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.delete = async (req, res) => {

  try {

    // ตรวจสอบว่ามี KPI ใช้งานอยู่หรือไม่

    const [used] = await db.query(
      `
      SELECT indicator_id
      FROM indicator
      WHERE category_id = ?
      `,
      [req.params.id]
    );

    if (used.length > 0) {

      return res.status(400).json({
        message:
          'ไม่สามารถลบหมวดหมู่ได้ เนื่องจากมี KPI ใช้งานอยู่'
      });

    }

    await db.query(
      `
      DELETE FROM indicator_category
      WHERE category_id = ?
      `,
      [req.params.id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.getById = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT *
      FROM indicator_category
      WHERE category_id = ?
    `,
    [req.params.id]);

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getByStrategy = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM indicator_category
      WHERE strategy_id = ?
      `,
      [req.params.id]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};
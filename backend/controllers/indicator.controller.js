const db = require('../config/db');

exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query(`
SELECT

  i.indicator_id,
  i.indicator_code,
  i.indicator_name,
  i.target_direction,
  c.category_name,
  s.strategy_name,

  (
  SELECT t.target_value
  FROM indicator_target t

  JOIN system_setting ss
  ON t.year_id =
  ss.current_year_id

  WHERE t.indicator_id =
  i.indicator_id

  LIMIT 1
) AS target_value,

  (
  SELECT COALESCE(
    SUM(r.actual_value),
    0
  )
  FROM indicator_result r

  JOIN system_setting ss
  ON r.year_id = ss.current_year_id

  WHERE r.indicator_id = i.indicator_id
) AS result_value

FROM indicator i

LEFT JOIN indicator_category c
ON i.category_id = c.category_id

LEFT JOIN strategy s
ON i.strategy_id = s.strategy_id

ORDER BY i.indicator_id
`);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.create = async (req, res) => {

  try {

    console.log('BODY = ', req.body);

    const {
      code,
      name,
      category_id,
      owner_user_id,
      target_direction
    } = req.body;

    // หา strategy_id จาก category

    const [category] = await db.query(
      `
      SELECT strategy_id
      FROM indicator_category
      WHERE category_id = ?
      `,
      [category_id]
    );

    if (category.length === 0) {

      return res.status(400).json({
        message: 'Category not found'
      });

    }

    const strategy_id =
      category[0].strategy_id;

    const [exists] = await db.query(
      `
  SELECT indicator_id
  FROM indicator
  WHERE indicator_code = ?
  `,
      [code]
    );

    if (exists.length > 0) {

      return res.status(400).json({
        message: 'รหัส KPI นี้มีอยู่แล้ว'
      });

    }

    await db.query(
      `
INSERT INTO indicator
(
  strategy_id,
  category_id,
  owner_user_id,
  indicator_code,
  indicator_name,
  target_direction
)
VALUES (?, ?, ?, ?, ?, ?)
`,
      [
        strategy_id,
        category_id,
        owner_user_id,
        code,
        name,
        target_direction
      ]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.delete = async (req, res) => {

  try {

    await db.query(
      'DELETE FROM indicator WHERE indicator_id = ?',
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
      'SELECT * FROM indicator WHERE indicator_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.update = async (req, res) => {

  try {

    const {
      code,
      name,
      category_id,
      owner_user_id,
      target_direction
    } = req.body;

    const [category] = await db.query(
      `
SELECT strategy_id
FROM indicator_category
WHERE category_id = ?
`,
      [category_id]
    );

    const strategy_id =
      category[0].strategy_id;

    await db.query(
      `
UPDATE indicator
SET
  strategy_id = ?,
  category_id = ?,
  owner_user_id = ?,
  indicator_code = ?,
  indicator_name = ?,
  target_direction = ?
WHERE indicator_id = ?
`,
      [
        strategy_id,
        category_id,
        owner_user_id,
        code,
        name,
        target_direction,
        req.params.id
      ]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

};

exports.getMyKpi = async (req, res) => {


  try {

    const [rows] = await db.query(`
      SELECT

        i.indicator_id,
        i.indicator_code,
        i.indicator_name,
        i.target_direction,
        c.category_name,
        s.strategy_name,

        s.strategy_name,

      (
  SELECT r.result_id
  FROM indicator_result r
  WHERE r.indicator_id = i.indicator_id
  ORDER BY r.result_id DESC
  LIMIT 1
) AS latest_result_id,

(
  SELECT 4
FROM indicator_target t

JOIN system_setting ss
ON t.year_id = ss.current_year_id

WHERE t.indicator_id = i.indicator_id
LIMIT 1
) AS target_count,

(
  SELECT COUNT(*)

  FROM indicator_result r

  JOIN system_setting ss
  ON r.year_id =
     ss.current_year_id

  WHERE r.indicator_id =
        i.indicator_id

) AS completed_quarters,

(
  SELECT COUNT(DISTINCT r.result_id)

  FROM evidence e

  JOIN indicator_result r
  ON e.result_id = r.result_id

  JOIN system_setting ss
  ON r.year_id =
     ss.current_year_id

  WHERE r.indicator_id =
        i.indicator_id

) AS evidence_quarters,

(
  SELECT 4
) AS total_quarters,

        (
  SELECT t.target_value

  FROM indicator_target t

  JOIN system_setting ss
  ON t.year_id =
     ss.current_year_id

  WHERE t.indicator_id =
        i.indicator_id

  LIMIT 1
) AS target_value,

        (
  SELECT COALESCE(
    SUM(r.actual_value),
    0
  )

  FROM indicator_result r

  JOIN system_setting ss
  ON r.year_id =
     ss.current_year_id

  WHERE r.indicator_id =
        i.indicator_id

) AS result_value

      FROM indicator i

      LEFT JOIN indicator_category c
      ON i.category_id = c.category_id

      LEFT JOIN strategy s
      ON i.strategy_id = s.strategy_id

      WHERE i.owner_user_id = ?

      ORDER BY i.indicator_id
    `,
      [req.params.userId]);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.getDetail = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT

        i.*,
        c.category_name,
        u.full_name

      FROM indicator i

      LEFT JOIN indicator_category c
      ON i.category_id = c.category_id

      LEFT JOIN user u
      ON i.owner_user_id = u.user_id

      WHERE i.indicator_id = ?
      `,
      [req.params.id]
    );

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getByCategory = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        i.indicator_id,
        i.indicator_code,
        i.indicator_name,
        i.target_direction,
        c.category_name,
        s.strategy_name,

        (
  SELECT t.target_value
  FROM indicator_target t

  JOIN system_setting ss
  ON t.year_id = ss.current_year_id

  WHERE t.indicator_id = i.indicator_id

  LIMIT 1
) AS target_value,

        (
  SELECT COALESCE(
    SUM(r.actual_value),
    0
  )
  FROM indicator_result r

  JOIN system_setting ss
  ON r.year_id = ss.current_year_id

  WHERE r.indicator_id = i.indicator_id
) AS result_value

      FROM indicator i

      LEFT JOIN indicator_category c
      ON i.category_id = c.category_id

      LEFT JOIN strategy s
      ON i.strategy_id = s.strategy_id

      WHERE i.category_id = ?

      ORDER BY i.indicator_id
    `,
      [req.params.id]);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.getMyKpiDetail = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        t.target_id,
        t.year_id,
        f.year_name,
        t.target_value,

        r.result_id,
        r.actual_value,

        (
          SELECT COUNT(*)
          FROM evidence e
          WHERE e.result_id = r.result_id
        ) AS evidence_count

      FROM indicator_target t

JOIN fiscal_year f
ON t.year_id = f.year_id

JOIN system_setting ss
ON t.year_id = ss.current_year_id

LEFT JOIN indicator_result r
ON r.indicator_id = t.indicator_id
AND r.year_id = t.year_id

WHERE t.indicator_id = ?

      ORDER BY f.year_name
    `,
      [req.params.id]);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.getTimeline = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        t.target_id,
        t.target_value,

        f.year_id,
        f.year_name,

        q.quarter_id,
        q.quarter_name,

        r.result_id,
        r.actual_value,

        (
          SELECT COUNT(*)
          FROM evidence e
          WHERE e.result_id = r.result_id
        ) AS evidence_count

      FROM indicator_target t

      JOIN fiscal_year f
      ON t.year_id = f.year_id

      JOIN system_setting ss
      ON t.year_id = ss.current_year_id

      CROSS JOIN quarter q

      LEFT JOIN indicator_result r
      ON r.indicator_id = t.indicator_id
      AND r.year_id = t.year_id
      AND r.quarter_id = q.quarter_id

      WHERE t.indicator_id = ?

      ORDER BY
        f.year_name,
        q.quarter_id
    `,
      [req.params.id]);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};
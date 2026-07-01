const db = require('../config/db');

exports.getByIndicator = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT

  r.result_id,
  r.indicator_id,

  r.actual_value,
  r.achievement_percent,
  r.remark,

  f.year_name,

  q.quarter_name,

  (
    SELECT GROUP_CONCAT(file_name)
    FROM evidence e
    WHERE e.result_id = r.result_id
  ) AS evidence_files

FROM indicator_result r

JOIN fiscal_year f
ON r.year_id = f.year_id

LEFT JOIN quarter q
ON r.quarter_id = q.quarter_id

WHERE r.indicator_id = ?

ORDER BY
f.year_name,
q.quarter_id
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

    const {
      indicator_id,
      year_id,
      quarter_id,
      actual_value,
      remark
    } = req.body;

    // ตรวจสอบว่าปีนี้มี Result แล้วหรือยัง
    const [exists] =
      await db.query(
        `
SELECT result_id
FROM indicator_result
WHERE indicator_id=?
AND year_id=?
AND quarter_id=?
`,
        [
          indicator_id,
          year_id,
          quarter_id
        ]
      );

    if (exists.length > 0) {

      return res.status(400).json({
        message: 'ไตรมาสนี้มีข้อมูลแล้ว'
      });

    }

    const [targets] = await db.query(
      `
  SELECT target_value
  FROM indicator_target
  WHERE indicator_id = ?
  AND year_id = ?
  `,
      [indicator_id, year_id]
    );
    let achievement = 0;

    if (targets.length > 0) {

      const targetValue =
        Number(targets[0].target_value);

      if (targetValue > 0) {

        achievement =
          (
            Number(actual_value)
            /
            targetValue
          ) * 100;

      } else {

        // กรณี Target = 0
        achievement = 0;

      }

    }

    console.log('USER = ', req.user);
    const [result] = await db.query(
      `
  INSERT INTO indicator_result
  (
    indicator_id,
    year_id,
    quarter_id,
    actual_value,
    achievement_percent,
    remark,
    created_by,
    updated_by
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        indicator_id,
        year_id,
        quarter_id,
        actual_value,
        achievement.toFixed(2),
        remark,
        req.user.user_id,
        req.user.user_id
      ]
    );

    res.json({
      success: true,
      result_id: result.insertId
    });

  } catch (error) {

    console.error("RESULT CREATE ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      error
    });

  }

};

exports.getById = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM indicator_result
      WHERE result_id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        message: 'Result not found'
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
      quarter_id,
      actual_value,
      remark
    } = req.body;

    const [targets] = await db.query(
      `
  SELECT target_value
  FROM indicator_target
  WHERE year_id = ?
  AND indicator_id =
  (
    SELECT indicator_id
    FROM indicator_result
    WHERE result_id = ?
  )
  `,
      [year_id, req.params.id]
    );

    let achievement = 0;

    if (targets.length > 0) {

      const targetValue =
        Number(targets[0].target_value);

      if (targetValue > 0) {

        achievement =
          (
            Number(actual_value)
            /
            targetValue
          ) * 100;

      } else {

        // กรณี Target = 0
        achievement = 0;

      }

    }

    await db.query(
      `
      UPDATE indicator_result
      SET
        year_id = ?,
        quarter_id = ?,
        actual_value = ?,
        achievement_percent = ?,
        remark = ?
      WHERE result_id = ?
      `,
      [
        year_id,
        quarter_id,
        actual_value,
        achievement.toFixed(2),
        remark,
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

exports.delete = async (req, res) => {

  try {

    await db.query(
      `
      DELETE FROM indicator_result
      WHERE result_id = ?
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
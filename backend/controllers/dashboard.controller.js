
const db = require('../config/db');

exports.summary = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        SUM(
          CASE
            WHEN target_value IS NOT NULL
            THEN 1
            ELSE 0
          END
        ) AS total,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value >= target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value <= target_value
            THEN 1

            ELSE 0

          END
        ) AS success,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value < target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value > target_value
            THEN 1

            ELSE 0

          END
        ) AS failed

      FROM (

        SELECT

          i.indicator_id,
          i.target_direction,

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

          ) AS result_value,

          (
            SELECT COUNT(*)

            FROM indicator_result r

            JOIN system_setting ss
              ON r.year_id = ss.current_year_id

            WHERE r.indicator_id = i.indicator_id

          ) AS result_count

        FROM indicator i

      ) x
    `);

    const data = rows[0];

    data.percent =
      data.total > 0
        ? (data.success / data.total) * 100
        : 0;

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.byStrategy = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        strategy_name,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value >= target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value <= target_value
            THEN 1

            ELSE 0

          END
        ) AS success,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value < target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value > target_value
            THEN 1

            ELSE 0

          END
        ) AS failed

      FROM (

        SELECT

          s.strategy_name,
          i.target_direction,

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

          ) AS result_value,

          (
            SELECT COUNT(*)

            FROM indicator_result r

            JOIN system_setting ss
              ON r.year_id = ss.current_year_id

            WHERE r.indicator_id = i.indicator_id

          ) AS result_count

        FROM indicator i

        JOIN strategy s
          ON i.strategy_id = s.strategy_id

      ) x

      GROUP BY strategy_name

      ORDER BY strategy_name
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.byCategory = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        category_name,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value >= target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value <= target_value
            THEN 1

            ELSE 0

          END
        ) AS success,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value < target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value > target_value
            THEN 1

            ELSE 0

          END
        ) AS failed

      FROM (

        SELECT

          c.category_name,
          i.target_direction,

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

          ) AS result_value,

          (
            SELECT COUNT(*)

            FROM indicator_result r

            JOIN system_setting ss
              ON r.year_id = ss.current_year_id

            WHERE r.indicator_id = i.indicator_id

          ) AS result_count

        FROM indicator i

        JOIN indicator_category c
          ON i.category_id = c.category_id

      ) x

      GROUP BY category_name

      ORDER BY category_name
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.byKpi = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        i.indicator_id,
        i.target_direction,
        i.indicator_code,
        i.indicator_name,

        (
          SELECT t.target_value
          FROM indicator_target t

          JOIN system_setting ss
          ON t.year_id = ss.current_year_id

          WHERE t.indicator_id = i.indicator_id

          LIMIT 1
        ) target_value,

        (
          SELECT COUNT(*)

          FROM indicator_result r

          JOIN system_setting ss
          ON r.year_id = ss.current_year_id

          WHERE r.indicator_id = i.indicator_id

        ) result_count,

        (
          SELECT COALESCE(
            SUM(r.actual_value),
            0
          )

          FROM indicator_result r

          JOIN system_setting ss
          ON r.year_id = ss.current_year_id

          WHERE r.indicator_id = i.indicator_id
        ) result_value

      FROM indicator i

      ORDER BY i.indicator_code
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.byPlan = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT

        plan_name,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value >= target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value <= target_value
            THEN 1

            ELSE 0

          END
        ) AS success,

        SUM(
          CASE

            WHEN result_count = 0
            THEN 0

            WHEN target_direction = 'HIGHER_BETTER'
              AND result_value < target_value
            THEN 1

            WHEN target_direction = 'LOWER_BETTER'
              AND result_value > target_value
            THEN 1

            ELSE 0

          END
        ) AS failed

      FROM (

        SELECT

          p.plan_name,
          i.target_direction,

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

          ) AS result_value,

          (
            SELECT COUNT(*)

            FROM indicator_result r

            JOIN system_setting ss
              ON r.year_id = ss.current_year_id

            WHERE r.indicator_id = i.indicator_id

          ) AS result_count

        FROM indicator i

        JOIN strategy s
          ON i.strategy_id = s.strategy_id

        JOIN strategic_plan p
          ON s.plan_id = p.plan_id

      ) x

      GROUP BY plan_name

      ORDER BY plan_name
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

exports.pendingKpi = async (req, res) => {

  try {

    const yearId = req.query.yearId;

    const [rows] = await db.query(
      `
      SELECT
        i.indicator_id,
        i.indicator_code,
        i.indicator_name,
        u.full_name AS owner_name

      FROM indicator i

      JOIN user u
        ON u.user_id = i.owner_user_id

      LEFT JOIN indicator_result r
        ON r.indicator_id = i.indicator_id
        AND r.year_id = ?

      WHERE
        r.result_id IS NULL

      ORDER BY
        u.full_name,
        i.indicator_code
      `,
      [yearId]
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }

};

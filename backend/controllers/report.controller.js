const reportService =
    require('../services/report.service');

exports.plan = async (req, res) => {

    try {

        const rows =
            await reportService.plan(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.strategy = async (req, res) => {

    try {

        const rows =
            await reportService.strategy(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.category = async (req, res) => {

    try {

        const rows =
            await reportService.category(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.kpi = async (req, res) => {

    try {

        const rows =

            await reportService
                .kpi(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.quarter = async (req, res) => {

    try {

        const rows =
            await reportService.quarter(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.trend = async (req, res) => {

    try {

        const rows = await reportService.trend(req.query);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.reportByIndicator = async (req, res) => {

    try {

        const db = require('../config/db');

        const { indicator_id, year_id } = req.query;

        let sql = `
        SELECT

            fy.year_name,

            q.quarter_name,

            t.target_value,

            r.actual_value AS result_value,

            i.target_direction,

            i.indicator_code,

            i.indicator_name

        FROM indicator_result r

        JOIN quarter q
            ON q.quarter_id = r.quarter_id

        JOIN indicator_target t
            ON t.indicator_id = r.indicator_id
            AND t.year_id = r.year_id

        JOIN indicator i
            ON i.indicator_id = r.indicator_id

        JOIN fiscal_year fy
            ON fy.year_id = r.year_id
            

        WHERE 1=1
        `;

        const params = [];

        if (indicator_id) {

            sql += ` AND r.indicator_id = ?`;

            params.push(indicator_id);

        }

        if (year_id) {

            sql += ` AND r.year_id = ?`;

            params.push(year_id);

        }

        sql += ` ORDER BY q.quarter_id`;

        const [rows] = await db.query(sql, params);

        res.json(rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

exports.indicatorYear = async (req, res) => {

    try {

        const db = require('../config/db');

        const { indicator_id, year_id } = req.query;

        let sql = `
SELECT
    fy.year_name,
    t.target_value,
    SUM(r.actual_value) AS result_value,
    i.target_direction,
    i.indicator_code,
    i.indicator_name
FROM indicator_target t

LEFT JOIN indicator_result r
    ON r.indicator_id = t.indicator_id
    AND r.year_id = t.year_id

JOIN fiscal_year fy
    ON fy.year_id = t.year_id

JOIN indicator i
    ON i.indicator_id = t.indicator_id

WHERE 1=1
`;

        const params = [];

        if (indicator_id) {
            sql += ` AND t.indicator_id = ?`;
            params.push(indicator_id);
        }

        if (year_id) {
            sql += ` AND t.year_id = ?`;
            params.push(year_id);
        }

        sql += `
GROUP BY
    fy.year_id,
    fy.year_name,
    t.target_value,
    i.target_direction,
    i.indicator_code,
    i.indicator_name

ORDER BY fy.year_id
`;

        const [rows] = await db.query(sql, params);

        res.json(rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};
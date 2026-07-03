const db = require('../config/db');

/*
===========================================
สร้าง WHERE และ Params
===========================================
*/

function buildFilter(filter) {

    const where = [];
    const params = [];

    if (filter.year_id) {
        where.push("t.year_id = ?");
        params.push(filter.year_id);
    }

    if (filter.plan_id) {
        where.push("sp.plan_id = ?");
        params.push(filter.plan_id);
    }

    if (filter.strategy_id) {
        where.push("s.strategy_id = ?");
        params.push(filter.strategy_id);
    }

    if (filter.category_id) {
        where.push("c.category_id = ?");
        params.push(filter.category_id);
    }

    return {
        where,
        params
    };

}

function buildWhere(where) {

    if (where.length > 0) {

        return " WHERE " + where.join(" AND ");

    }

    return "";

}

/*
===========================================
รายงานตามแผนกลยุทธ์
===========================================
*/

exports.plan = async (filter) => {

    const { where, params } = buildFilter(filter);

    let sql = `

SELECT

sp.plan_id,

sp.plan_name,

COUNT(DISTINCT i.indicator_id) total_kpi,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value>=t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value<=t.target_value

THEN 1

ELSE 0

END

) success,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value<t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value>t.target_value

THEN 1

ELSE 0

END

) failed

FROM strategic_plan sp

LEFT JOIN strategy s
ON sp.plan_id=s.plan_id

LEFT JOIN indicator i
ON s.strategy_id=i.strategy_id

LEFT JOIN indicator_category c
ON i.category_id=c.category_id

LEFT JOIN indicator_target t
ON t.indicator_id=i.indicator_id

LEFT JOIN(

SELECT

indicator_id,
year_id,

SUM(actual_value) result_value

FROM indicator_result

GROUP BY
indicator_id,
year_id

) rv

ON rv.indicator_id=i.indicator_id
AND rv.year_id=t.year_id

`;

    sql += buildWhere(where);

    sql += `

GROUP BY

sp.plan_id,
sp.plan_name

ORDER BY

sp.plan_name

`;
    console.log(sql);

    const [rows] = await db.query(sql, params);

    return rows;

};

/*
===========================================
รายงานตามยุทธศาสตร์
===========================================
*/

exports.strategy = async (filter) => {

    const { where, params } = buildFilter(filter);

    let sql = `

SELECT

s.strategy_id,

s.strategy_name,

COUNT(DISTINCT i.indicator_id) total_kpi,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value>=t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value<=t.target_value

THEN 1

ELSE 0

END

) success,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value<t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value>t.target_value

THEN 1

ELSE 0

END

) failed

FROM strategy s

LEFT JOIN strategic_plan sp
ON s.plan_id=sp.plan_id

LEFT JOIN indicator i
ON s.strategy_id=i.strategy_id

LEFT JOIN indicator_category c
ON i.category_id=c.category_id

LEFT JOIN indicator_target t
ON t.indicator_id=i.indicator_id

LEFT JOIN(

SELECT

indicator_id,
year_id,

SUM(actual_value) result_value

FROM indicator_result

GROUP BY
indicator_id,
year_id

) rv

ON rv.indicator_id=i.indicator_id
AND rv.year_id=t.year_id

`;

    sql += buildWhere(where);

    sql += `

GROUP BY

s.strategy_id,
s.strategy_name

ORDER BY

s.strategy_name

`;
    console.log(sql);

    const [rows] = await db.query(sql, params);

    return rows;

};

/*
===========================================
รายงานตามหมวดหมู่
===========================================
*/

exports.category = async (filter) => {

    const { where, params } = buildFilter(filter);

    let sql = `

SELECT

c.category_id,

c.category_name,

COUNT(DISTINCT i.indicator_id) total_kpi,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value>=t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value<=t.target_value

THEN 1

ELSE 0

END

) success,

SUM(

CASE

WHEN rv.result_value IS NULL
THEN 0

WHEN i.target_direction='HIGHER_BETTER'
AND rv.result_value<t.target_value

THEN 1

WHEN i.target_direction='LOWER_BETTER'
AND rv.result_value>t.target_value

THEN 1

ELSE 0

END

) failed

FROM indicator_category c

LEFT JOIN indicator i
ON c.category_id=i.category_id

LEFT JOIN strategy s
ON i.strategy_id=s.strategy_id

LEFT JOIN strategic_plan sp
ON s.plan_id=sp.plan_id

LEFT JOIN indicator_target t
ON t.indicator_id=i.indicator_id

LEFT JOIN(

SELECT

indicator_id,
year_id,

SUM(actual_value) result_value

FROM indicator_result

GROUP BY
indicator_id,
year_id

) rv

ON rv.indicator_id=i.indicator_id
AND rv.year_id=t.year_id

`;

    sql += buildWhere(where);

    sql += `

GROUP BY

c.category_id,
c.category_name

ORDER BY

c.category_name

`;
    console.log(sql);

    const [rows] = await db.query(sql, params);

    return rows;

};

/*
===========================================
รายงานตาม KPI
===========================================
*/

exports.kpi = async (filter) => {

    console.log("FILTER =", filter);

    const { where, params } = buildFilter(filter);

    console.log("WHERE =", where);
    console.log("PARAMS =", params);

    let sql = `

SELECT

sp.plan_name,

s.strategy_name,

c.category_name,

i.indicator_id,

i.indicator_code,

i.indicator_name,

i.target_direction,

COALESCE(t.target_value,0) target_value,

COALESCE(rv.result_value,0) result_value

FROM indicator i

LEFT JOIN strategy s
ON i.strategy_id = s.strategy_id

LEFT JOIN strategic_plan sp
ON s.plan_id = sp.plan_id

LEFT JOIN indicator_category c
ON i.category_id = c.category_id

LEFT JOIN indicator_target t
ON i.indicator_id = t.indicator_id

LEFT JOIN (

SELECT

indicator_id,

year_id,

SUM(actual_value) result_value

FROM indicator_result

GROUP BY
indicator_id,
year_id

) rv

ON rv.indicator_id = t.indicator_id
AND rv.year_id = t.year_id

`;

    sql += buildWhere(where);

    sql += `

ORDER BY

sp.plan_name,

s.strategy_name,

c.category_name,

i.indicator_code

`;
    console.log(sql);

    const [rows] = await db.query(sql, params);

    return rows;

};

/*
===========================================
รายงานตามไตรมาส
===========================================
*/

exports.quarter = async (filter) => {

    const where = [];
    const params = [];

    if (filter.year_id) {

        where.push("r.year_id = ?");
        params.push(filter.year_id);

    }

    if (filter.quarter_id) {

        where.push("r.quarter_id = ?");
        params.push(filter.quarter_id);

    }

    if (filter.plan_id) {

        where.push("sp.plan_id = ?");
        params.push(filter.plan_id);

    }

    if (filter.strategy_id) {

        where.push("s.strategy_id = ?");
        params.push(filter.strategy_id);

    }

    if (filter.category_id) {

        where.push("c.category_id = ?");
        params.push(filter.category_id);

    }

    let sql = `

SELECT

q.quarter_name,

sp.plan_name,

s.strategy_name,

c.category_name,

i.indicator_code,

i.indicator_name,

i.target_direction,

COALESCE(t.target_value,0) target_value,

COALESCE(r.actual_value,0) result_value

FROM indicator_result r

LEFT JOIN indicator i
ON r.indicator_id=i.indicator_id

LEFT JOIN quarter q
ON r.quarter_id=q.quarter_id

LEFT JOIN strategy s
ON i.strategy_id=s.strategy_id

LEFT JOIN strategic_plan sp
ON s.plan_id=sp.plan_id

LEFT JOIN indicator_category c
ON i.category_id=c.category_id

LEFT JOIN indicator_target t
ON t.indicator_id=i.indicator_id
AND t.year_id=r.year_id

`;

    sql += buildWhere(where);

    sql += `

ORDER BY

q.quarter_id,

sp.plan_name,

s.strategy_name,

i.indicator_code

`;

    const [rows] = await db.query(sql, params);

    return rows;

};

/*
===========================================
Trend KPI
===========================================
*/

exports.trend = async (filter) => {

    const params = [];

    let sql = `

SELECT

fy.year_id,

fy.year_name,

COALESCE(t.target_value,0) target_value,

COALESCE(SUM(r.actual_value),0) result_value,
i.target_direction

FROM indicator_target t

INNER JOIN indicator i
ON i.indicator_id = t.indicator_id

INNER JOIN fiscal_year fy
ON t.year_id = fy.year_id

LEFT JOIN indicator_result r
ON r.indicator_id = t.indicator_id
AND r.year_id = t.year_id

WHERE 1=1

`;

    if(filter.indicator_id){

        sql += " AND t.indicator_id=? ";

        params.push(filter.indicator_id);

    }

    sql += `

GROUP BY

fy.year_id,
fy.year_name,
t.target_value,
i.target_direction

ORDER BY

fy.year_id

`;

    // จำกัดจำนวนปี

    if(filter.years && filter.years!='all'){

        sql += " LIMIT " + Number(filter.years);

    }

    const [rows] = await db.query(sql,params);

    return rows;

};


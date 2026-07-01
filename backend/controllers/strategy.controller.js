const db = require('../config/db');

exports.getAll = async (req,res)=>{

  try{

    const [rows] = await db.query(`
      SELECT
        s.*,
        p.plan_name
      FROM strategy s
      JOIN strategic_plan p
      ON s.plan_id = p.plan_id
      ORDER BY s.strategy_id
    `);

    res.json(rows);

  }catch(error){

    res.status(500).json(error);

  }

};

exports.getById = async(req,res)=>{

  try{

    const [rows] = await db.query(`
      SELECT *
      FROM strategy
      WHERE strategy_id = ?
    `,
    [req.params.id]);

    res.json(rows[0]);

  }catch(error){

    res.status(500).json(error);

  }

};

exports.create = async(req,res)=>{

  try{

    const {
      plan_id,
      strategy_code,
      strategy_name,
      description
    } = req.body;

    await db.query(`
      INSERT INTO strategy
      (
        plan_id,
        strategy_code,
        strategy_name,
        description
      )
      VALUES (?,?,?,?)
    `,
    [
      plan_id,
      strategy_code,
      strategy_name,
      description
    ]);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json(error);

  }

};

exports.update = async(req,res)=>{

  try{

    const {
      plan_id,
      strategy_code,
      strategy_name,
      description
    } = req.body;

    await db.query(`
      UPDATE strategy
      SET
        plan_id=?,
        strategy_code=?,
        strategy_name=?,
        description=?
      WHERE strategy_id=?
    `,
    [
      plan_id,
      strategy_code,
      strategy_name,
      description,
      req.params.id
    ]);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json(error);

  }

};

exports.delete = async(req,res)=>{

  try{

    await db.query(`
      DELETE FROM strategy
      WHERE strategy_id=?
    `,
    [req.params.id]);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json(error);

  }

};

exports.getByPlan = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
s.strategy_id,
s.strategy_code,
s.strategy_name,
s.plan_id,
p.plan_name
FROM strategy s
JOIN strategic_plan p
ON s.plan_id = p.plan_id
WHERE s.plan_id = ?
      ORDER BY strategy_code
      `,
      [req.params.planId]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};
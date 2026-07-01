const db = require('../config/db');

exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT *
      FROM strategic_plan
      ORDER BY plan_id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getById = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT *
      FROM strategic_plan
      WHERE plan_id = ?
    `,
    [req.params.id]);

    if(rows.length === 0){

      return res.status(404).json({
        message:'Plan not found'
      });

    }

    res.json(rows[0]);

  } catch(error){

    res.status(500).json(error);

  }

};

exports.create = async (req,res)=>{

  try{

    const {
      plan_code,
      plan_name,
      start_year,
      end_year,
      description
    } = req.body;

    await db.query(`
      INSERT INTO strategic_plan
      (
        plan_code,
        plan_name,
        start_year,
        end_year,
        description
      )
      VALUES (?,?,?,?,?)
    `,
    [
      plan_code,
      plan_name,
      start_year,
      end_year,
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
      plan_code,
      plan_name,
      start_year,
      end_year,
      description
    } = req.body;

    await db.query(`
      UPDATE strategic_plan
      SET
      plan_code=?,
      plan_name=?,
      start_year=?,
      end_year=?,
      description=?
      WHERE plan_id=?
    `,
    [
      plan_code,
      plan_name,
      start_year,
      end_year,
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
      DELETE FROM strategic_plan
      WHERE plan_id=?
    `,
    [req.params.id]);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json(error);

  }

};
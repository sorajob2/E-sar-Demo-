const db = require('../config/db');

exports.getCurrentYear =
async (req,res)=>{

  try{

    const [rows] =
    await db.query(`
      SELECT

        s.current_year_id,
        f.year_name

      FROM system_setting s

      JOIN fiscal_year f
      ON s.current_year_id =
      f.year_id

      LIMIT 1
    `);

    res.json(rows[0]);

  }catch(error){

    res.status(500).json(error);

  }

};

exports.updateCurrentYear =
async(req,res)=>{

  try{

    await db.query(`
      UPDATE system_setting
      SET current_year_id=?
      WHERE setting_id=1
    `,
    [
      req.body.current_year_id
    ]);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json(error);

  }

};
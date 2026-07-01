const db = require('../config/db');

exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query(
      'SELECT * FROM fiscal_year'
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json(error);

  }

};
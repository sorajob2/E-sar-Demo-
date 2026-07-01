const express = require('express');
const router = express.Router();

const fiscalYearController =
require('../controllers/fiscalYear.controller');

router.get(
  '/fiscal-years',
  fiscalYearController.getAll
);

module.exports = router;
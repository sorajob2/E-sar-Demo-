const express = require('express');

const router = express.Router();

const reportController =
require('../controllers/report.controller');

router.get('/plan', reportController.plan);

router.get('/strategy', reportController.strategy);

router.get('/category', reportController.category);

router.get('/kpi', reportController.kpi);

router.get('/quarter', reportController.quarter);

router.get('/trend', reportController.trend);

router.get('/indicator', reportController.reportByIndicator);

router.get('/indicator-year', reportController.indicatorYear);

module.exports = router;
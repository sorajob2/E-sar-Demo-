const express = require('express');
const router = express.Router();

const dashboardController =
  require('../controllers/dashboard.controller');

router.get(
  '/dashboard/summary',
  dashboardController.summary
);

router.get(
  '/dashboard/strategy',
  dashboardController.byStrategy
);

router.get(
  '/dashboard/category',
  dashboardController.byCategory
);

router.get(
  '/dashboard/kpi',
  dashboardController.byKpi
);

router.get(
  '/dashboard/plan',
  dashboardController.byPlan
);

router.get(
  '/dashboard/pending-kpi',
  dashboardController.pendingKpi
);

module.exports = router;
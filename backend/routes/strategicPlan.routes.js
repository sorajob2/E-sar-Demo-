const express = require('express');
const router = express.Router();

const strategicPlanController =
require('../controllers/strategicPlan.controller');

router.get(
  '/strategic-plans',
  strategicPlanController.getAll
);

router.get(
  '/strategic-plan/:id',
  strategicPlanController.getById
);

router.post(
  '/strategic-plan',
  strategicPlanController.create
);

router.put(
  '/strategic-plan/:id',
  strategicPlanController.update
);

router.delete(
  '/strategic-plan/:id',
  strategicPlanController.delete
);

module.exports = router;
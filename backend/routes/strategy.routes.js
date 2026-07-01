const express = require('express');
const router = express.Router();

const strategyController =
require('../controllers/strategy.controller');

router.get(
  '/strategies',
  strategyController.getAll
);

router.get(
  '/strategies/plan/:planId',
  strategyController.getByPlan
);

router.get(
  '/strategy/:id',
  strategyController.getById
);

router.post(
  '/strategy',
  strategyController.create
);

router.put(
  '/strategy/:id',
  strategyController.update
);

router.delete(
  '/strategy/:id',
  strategyController.delete
);





module.exports = router;
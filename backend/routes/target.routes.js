const express = require('express');
const router = express.Router();

const targetController =
require('../controllers/target.controller');

const auth =
require('../middleware/auth');

router.post(
  '/targets',
  auth,
  targetController.create
);

router.get(
  '/targets/:indicatorId',
  auth,
  targetController.getByIndicator
);

router.get(
  '/targets/detail/:id',
  auth,
  targetController.getById
);

router.put(
  '/targets/:id',
  auth,
  targetController.update
);

router.delete(
  '/targets/:id',
  auth,
  targetController.delete
);

module.exports = router;
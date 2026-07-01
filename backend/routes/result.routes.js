const express = require('express');
const router = express.Router();

const resultController =
require('../controllers/result.controller');

const auth =
require('../middleware/auth');

router.get(
  '/results/:indicatorId',
  resultController.getByIndicator
);

router.post(
  '/results',
  auth,
  resultController.create
);

router.get(
  '/result/:id',
  resultController.getById
);

router.put(
  '/result/:id',
  resultController.update
);

router.delete(
  '/results/:id',
  resultController.delete
);

module.exports = router;

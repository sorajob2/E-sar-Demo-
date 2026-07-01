const express = require('express');
const router = express.Router();

const categoryController =
require('../controllers/category.controller');

router.get(
  '/categories',
  categoryController.getAll
);

router.get(
  '/category/:id',
  categoryController.getById
);

router.post(
  '/category',
  categoryController.create
);

router.put(
  '/category/:id',
  categoryController.update
);

router.delete(
  '/category/:id',
  categoryController.delete
);

router.get(
  '/categories/strategy/:id',
  categoryController.getByStrategy
);

module.exports = router;
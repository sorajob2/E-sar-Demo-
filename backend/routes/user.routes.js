const express = require('express');
const router = express.Router();

const userController =
require('../controllers/user.controller');



router.get(
  '/users/staff',
  userController.getStaffs
);

router.get('/users', userController.getAll);

router.get('/users/:id', userController.getById);

router.post('/users', userController.create);

router.put('/users/:id', userController.update);

//router.delete('/users/:id', userController.delete);

module.exports = router;
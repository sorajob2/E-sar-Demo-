const express = require('express');
const router = express.Router();

const settingController =
require('../controllers/setting.controller');

router.get(
  '/current-year',
  settingController.getCurrentYear
);

router.put(
  '/current-year',
  settingController.updateCurrentYear
);

module.exports = router;
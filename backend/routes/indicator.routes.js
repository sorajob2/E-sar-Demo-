const express = require("express");
const router = express.Router();
const indicatorController = require('../controllers/indicator.controller');
const auth = require("../middleware/auth");

router.get("/indicators", indicatorController.getAll);
router.post(
  "/indicators",
  auth,
  indicatorController.create
);

router.delete(
  '/indicators/:id',
  indicatorController.delete
);

router.get(
  '/indicators/detail/:id',
  auth,
  indicatorController.getDetail
);

router.get(
  '/indicators/status/:id',
  indicatorController.getMyKpiDetail
);

router.get(
  '/indicators/timeline/:id',
  indicatorController.getTimeline
);

router.get(
  '/indicators/:id',
  indicatorController.getById
);

router.put(
  '/indicators/:id',
  indicatorController.update
);

router.get(
  '/indicators/my-kpi/:userId',
  indicatorController.getMyKpi
);



router.get(
  '/indicators/category/:id',
  indicatorController.getByCategory
);


module.exports = router;
const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const evidenceController = require('../controllers/evidence.controller');

// ดึงรายการหลักฐานของ Result
router.get(
  '/result/:resultId',
  auth,
  evidenceController.getByResult
);

// อัปโหลดหลักฐาน
router.post(
  '/',
  auth,
  upload.single('file'),
  evidenceController.upload
);

// ลบหลักฐาน
router.delete(
  '/:id',
  auth,
  evidenceController.delete
);

module.exports = router;
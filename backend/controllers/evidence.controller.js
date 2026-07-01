const db = require('../config/db');
const path = require('path');

const googleDrive =
  require('../services/googleDrive.service');

exports.getByResult = async (req, res) => {

  try {

    const [rows] = await db.query(
      `
SELECT
    evidence_id,
    file_name,
    drive_link,
    file_size,
    uploaded_at
FROM evidence
WHERE result_id = ?
ORDER BY uploaded_at DESC
`,
      [req.params.resultId]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);
    res.status(500).json(error);

  }

};

exports.delete = async (req, res) => {

  try {

    const [[file]] = await db.query(
      `
      SELECT drive_file_id
      FROM evidence
      WHERE evidence_id = ?
      `,
      [req.params.id]
    );

    if (!file) {

      return res.status(404).json({
        message: "ไม่พบไฟล์"
      });

    }

    // ลบไฟล์ใน Google Drive
    await googleDrive.deleteFile(
      file.drive_file_id
    );

    // ลบข้อมูลใน Database
    await db.query(
      `
      DELETE FROM evidence
      WHERE evidence_id = ?
      `,
      [req.params.id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.upload = async (req, res) => {

  try {

    const { result_id } = req.body;

    if (!req.file) {

      return res.status(400).json({
        message: 'ไม่พบไฟล์'
      });

    }

    // อัปโหลดขึ้น Google Drive
    // ดึงข้อมูลปีงบประมาณและ KPI
    const [[result]] = await db.query(
      `
SELECT
    fy.year_name,
    i.indicator_code
FROM indicator_result ir
JOIN fiscal_year fy
    ON ir.year_id = fy.year_id
JOIN indicator i
    ON ir.indicator_id = i.indicator_id
WHERE ir.result_id = ?
`,
      [result_id]
    );

    if (!result) {
      return res.status(404).json({
        message: "ไม่พบข้อมูล Result"
      });
    }

    // อัปโหลดขึ้น Google Drive
    const driveFile =
      await googleDrive.uploadFile(
        req.file,
        result.year_name,
        result.indicator_code
      );

    // บันทึกลงฐานข้อมูล
    await db.query(
      `
INSERT INTO evidence
(
  result_id,
  file_name,
  drive_file_id,
  drive_link,
  file_path,
  file_size,
  uploaded_by
)
VALUES (?, ?, ?, ?, ?, ?, ?)
`,
      [
        result_id,
        req.file.originalname,
        driveFile.id,
        driveFile.view,
        driveFile.view,
        req.file.size,
        req.user.user_id
      ]
    );

    res.json({
      success: true,
      file: driveFile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
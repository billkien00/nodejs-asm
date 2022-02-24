const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");

router.get("/start", attendanceController.start);
router.patch("/started", attendanceController.started);
router.get("/end", attendanceController.end);
router.patch(
  "/registered",
  [
    body("date", "Ngày nghỉ chưa hợp lệ"),
    body("reason", "lý do chưa hợp lệ").isLength({ min: 5, max: 400 }).trim(),
  ],
  attendanceController.registered
);

router.get("/rest", attendanceController.rest);
router.get("/", attendanceController.index);

module.exports = router;

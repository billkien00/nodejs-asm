const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");

router.get("/start", attendanceController.start);
router.put("/started", attendanceController.started);
router.get("/end", attendanceController.end);
router.put("/registered", attendanceController.registered);

router.get("/rest", attendanceController.rest);
router.get("/", attendanceController.index);

module.exports = router;

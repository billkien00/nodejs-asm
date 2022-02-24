const express = require("express");
const router = express.Router();
const managerController = require("../controllers/ManagerController");
const isConfirm = require("../middleware/isConfirm");
const { body } = require("express-validator");

router.get("/covid/:userId", managerController.getCovidUser);
router.get("/covid", managerController.getCovid);

router.delete("/time/delete", isConfirm, managerController.delete);
router.get("/fix", isConfirm, managerController.fix);
router.patch(
  "/fixed",
  [
    body("day", "Ngày không hợp lệ").isInt({ min: 1, max: 30 }),
    body("month", "Tháng không hợp lệ").isInt({ min: 1, max: 12 }),
    body("startTime", "Giờ bắt dầu không hợp lệ"),
    body("endTime", "Giờ Kết thúc không hợp lệ"),
  ],
  isConfirm,
  managerController.fixed
);
router.patch("/time/confirm", isConfirm, managerController.confirm);

router.get("/time/:userId/:month", managerController.showMonth);
router.get("/time/:userId", managerController.getTimeDetail);
router.get("/time", managerController.getTime);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const covidController = require("../controllers/CovidController");

router.get('/download',covidController.download)

router.patch(
  "/",
  [
    body("temperature", "Nhiệt độ không hợp lệ").isNumeric(),
  ],
  covidController.covidUpdated
);
router.get("/", covidController.show);


module.exports = router;

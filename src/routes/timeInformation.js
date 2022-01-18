const express = require("express");
const router = express.Router();
const timeInformationController = require("../controllers/TimeInformationController");

router.get("/", timeInformationController.show);

module.exports = router;

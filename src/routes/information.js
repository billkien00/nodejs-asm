const express = require("express");
const router = express.Router();
const informationController = require("../controllers/InformationController");

router.put("/update", informationController.updated);
router.get("/update", informationController.update);

router.get("/", informationController.show);

module.exports = router;

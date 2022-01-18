const express = require("express");
const router = express.Router();
const covidController = require("../controllers/CovidController");

// router.put("/update", covidController.updated);
// router.get("/update", covidController.update);

router.put("/", covidController.covidUpdated);
router.get("/", covidController.show);

module.exports = router;
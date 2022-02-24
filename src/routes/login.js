const express = require("express");
const router = express.Router();
const loginController = require("../controllers/LoginController");
const { body } = require("express-validator");

router.get("/", loginController.getLogin);
router.post(
  "/",
  [
    body("email", "email không hợp lệ").isEmail(),
    body("password", "mật khẩu không hợp lệ").isAlphanumeric().trim(),
  ],
  loginController.postLogin
);
router.post("/logout", loginController.logout);

module.exports = router;

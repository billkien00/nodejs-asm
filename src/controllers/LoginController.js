const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

class LoginController {
  //[Get] /
  getLogin(req, res, next) {
    res.render("login", {
      pageTitle: "Đăng nhập",
      isLogged: false,
      errorMessage: "",
      oldInput: "",
    });
  }
  //[POST] /
  postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("login", {
        pageTitle: "Đăng nhập",
        errorMessage: errors.array()[0].msg,
        oldInput: req.body,
      });
    }

    User.findOne({ email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              req.session.logged = true;
              req.session.manager = user.manager;
              req.session.user = user;
              return req.session.save((err) => {
                // console.log(err);
                res.redirect("/");
              });
            }
            return res.status(422).render("login", {
              pageTitle: "Đăng nhập",
              errorMessage: "Email hoặc mật khẩu không đúng",
              oldInput: req.body,
              validationErrors: "",
            });
          })
          .catch((err) => next(new Error(err)));
      })
      .catch((err) => next(new Error(err)));
  }
  //[post] /
  logout(req, res, next) {
    req.session.destroy((err) => {
      // console.log(err);
      res.redirect("/");
    });
  }
}

module.exports = new LoginController();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

class SignupController {
  //[Get] /
  getSignup(req, res, next) {
    res.render("signup", { pageTitle: "Đăng nhập" });
  }
  //[post] /
  postSignup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const doB = req.body.doB;
    const salaryScale = 200;
    const startDate = new Date();
    const department = req.body.department;
    const manager = req.body.manager;
    const annualLeave = 6;
    const annualLeaveTime = 0;
    const image =
      "https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg";
    const online = false;
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          doB,
          salaryScale,
          startDate,
          department,
          manager,
          annualLeave,
          annualLeaveTime,
          image,
          online,
        });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => next(new Error(err)));
  }
}

module.exports = new SignupController();

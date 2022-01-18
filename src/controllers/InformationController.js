const User = require("../models/User");

//từ bản update express handlebar 4.6 trở đi
//ko cho phép truy cập trực tiếp của các property qua đối tượng
const { mongooseToObject } = require("../util/mongoose");

class InfomationController {
  //[GET] /
  show(req, res, next) {
    User.findOne(req.user._id)
      .then((user) => {
        res.render("information", { user: mongooseToObject(user) });
      })
      .catch((err) => console.log(err));
  }

  //[GET] /update
  update(req, res, next) {
    User.findOne(req.user._id)
      .then((user) => {
        res.render("updateimg", { user: mongooseToObject(user) });
      })
      .catch((err) => console.log(err));
  }

  //[PUT] /update
  updated(req, res, next) {
    User.findOneAndUpdate(req.user._id, req.body)
      .then((user) => {
        res.redirect("/information");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new InfomationController();

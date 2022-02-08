const User = require("../models/User");
const Timesheet = require("../models/Timesheet");

//từ bản update express handlebar 4.6 trở đi
//ko cho phép truy cập trực tiếp của các property qua đối tượng
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../util/mongoose");

class TimeInformationController {
  //[GET] /
  show(req, res, next) {
    Timesheet.find(req.user._id)
      .then((ts) => {
        ts.map((e) => {
          const a = [...e.items];
          res.render("timeInformation", {
            ts,
            a,
            pageTitle: "Thông tin giờ làm",
          });
        });
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new TimeInformationController();

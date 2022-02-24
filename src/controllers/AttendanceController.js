const User = require("../models/User");
const Timesheet = require("../models/Timesheet");
const Rest = require("../models/Rest");
const { validationResult } = require("express-validator");

class AttendanceController {
  //[GET] /attendance
  index(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        res.render("attendance", { user, pageTitle: "Điểm danh" });
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /attendance/start
  start(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        res.render("start", { user, pageTitle: "Điểm danh" });
      })
      .catch((err) => next(new Error(err)));
  }

  //[PUT] /attendance/started
  started(req, res, next) {
    req.body.online ? (req.body.online = false) : (req.body.online = true);
    Timesheet.findOne({
      userId: req.user._id,
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    })
      .then((ts) => {
        if (ts !== null) {
          ts.items.unshift({
            startTime: new Date(),
            workplace: req.body.location,
          });
          return ts.save();
        } else {
          const newTs = new Timesheet({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            items: [
              {
                startTime: new Date(),
                workplace: req.body.location,
              },
            ],
            totalHours: 0,
            overTime: 0,
            userId: req.user._id,
          });
          return newTs.save();
        }
      })
      .then((result) => {
        User.findOneAndUpdate({ _id: req.user._id }, req.body, {
          new: true, // return updated doc
          runValidators: true, // validate before update
        })
          .then((user) => {
            res.render("started", { user, pageTitle: "Đã điểm danh" });
          })
          .catch((err) => next(new Error(err)));
      })
      .catch((err) => next(new Error(err)));
  }

  //[get] /attendance/end
  end(req, res, next) {
    Timesheet.findOne({
      userId: req.user._id,
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    })
      .then((ts) => {
        const a = new Date().getHours() - ts.items[0].startTime.getHours();
        if (a <= 8) {
          ts.items[0].endTime = new Date();
          ts.items[0].hours =
            new Date().getHours() - ts.items[0].startTime.getHours();
          ts.totalHours +=
            new Date().getHours() - ts.items[0].startTime.getHours();
          return ts.save();
        } else {
          ts.items[0].endTime = new Date();
          ts.items[0].hours = 8;
          ts.overTime = a - 8;
          ts.totalHours += 8;
        }
      })
      .then((result) => {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { online: false },
          {
            new: true, // return updated doc
            runValidators: true, // validate before update
          }
        )
          .then((user) => {
            console.log(result);
            res.render("end", { user, result, pageTitle: "Kết thúc làm" });
          })
          .catch((err) => next(new Error(err)));
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /attendance/rest
  rest(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        res.render("rest", {
          user,
          pageTitle: "Nghỉ phép",
          oldInput: {},
          errorMessage: "",
        });
      })
      .catch((err) => next(new Error(err)));
  }

  //[PUT] /attendance/registered
  registered(req, res, next) {
    let date = [];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("rest", {
        user: req.user,
        pageTitle: "Nghỉ phép",
        errorMessage: errors.array()[0].msg,
        oldInput: req.body,
      });
    }
    req.body.date = req.body.date.split(",");
    req.body.date.map((e) => {
      date.push(new Date(e));
    });
    req.body.date = date;
    const a = (req.user.annualLeave -=
      (req.body.time / 8) * req.body.date.length);
    const b = (req.user.annualLeaveTime +=
      req.body.time * req.body.date.length);
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        annualLeave: a,
        annualLeaveTime: b,
      }
    )
      .then((user) => {
        req.body.userId = req.user._id;

        const rest = new Rest(req.body);
        rest.save();

        res.redirect("/");
      })
      .catch((err) => next(new Error(err)));
  }
}

module.exports = new AttendanceController();

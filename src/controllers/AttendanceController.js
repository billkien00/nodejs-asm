const User = require("../models/User");
const Timesheet = require("../models/Timesheet");
const Rest = require("../models/Rest");

class AttendanceController {
  //[GET] /attendance
  index(req, res, next) {
    User.findOne({})
      .then((user) => {
        res.render("attendance", { user, pageTitle: "Điểm danh" });
      })
      .catch(next);
  }

  //[GET] /attendance/start
  start(req, res, next) {
    User.findOne({})
      .then((user) => {
        res.render("start", { user, pageTitle: "Điểm danh" });
      })
      .catch(next);
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
            workplace: req.user.location,
          });
          return ts.save();
        } else {
          const newTs = new Timesheet({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            items: [
              {
                startTime: new Date(),
                workplace: req.user.location,
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
        User.findOneAndUpdate({}, req.body, {
          new: true, // return updated doc
          runValidators: true, // validate before update
        })
          .then((user) => {
            res.render("started", { user, pageTitle: "Đã điểm danh" });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //[GET] /attendance/end
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
          {},
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
          .catch((err) => console.log(err));
        s;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //[GET] /attendance/rest
  rest(req, res, next) {
    User.findOne({})
      .then((user) => {
        res.render("rest", { user, pageTitle: "Nghỉ phép" });
      })
      .catch(next);
  }

  //[PUT] /attendance/registered
  registered(req, res, next) {
    req.body.date = req.body.date.split(",");
    const a = (req.user.annualLeave -=
      (req.body.time / 8) * req.body.date.length);
    User.findOneAndUpdate(req.user._id, {
      annualLeave: a,
    })
      .then((user) => {
        const rest = new Rest(req.body);
        rest.save();
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new AttendanceController();

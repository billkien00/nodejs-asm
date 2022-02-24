const User = require("../models/User");
const Covid = require("../models/Covid");
const Timesheet = require("../models/Timesheet");
const { validationResult } = require("express-validator");

const ITEMS_PER_PAGE = 20;

class SiteController {
  //[GET] /covid
  getCovid(req, res, next) {
    User.find({ department: req.session.user.department, manager: false })
      .then((users) => {
        res.render("managerCovid", { users, pageTitle: "Covid" });
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /covid/:userId
  getCovidUser(req, res, next) {
    Covid.findOne({ userId: req.params.userId })
      .then((covid) => {
        res.render("covid", {
          covid,
          pageTitle: "Thông tin Covid",
          oldInput: {},
          errorMessage: "",
        });
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /time
  getTime(req, res, next) {
    User.find({ department: req.user.department, manager: false })
      .then((users) => {
        res.render("managerInfo", { users, pageTitle: "Covid" });
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /time/:userId
  getTimeDetail(req, res, next) {
    const page = +req.query.page || 1;
    let totalItems;
    let onlineDay;
    let onlineMonth;
    Timesheet.find({ userId: req.params.userId })
      .countDocuments()
      .then((num) => {
        totalItems = num;
        return Timesheet.find({ userId: req.params.userId })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((ts) => {
        ts.map((e) => {
          e.items.map((i) => {
            if (i.endTime == undefined) {
              onlineDay = e.day;
              onlineMonth = e.month;
            }
          });
        });

        res.render("mtimeInformation", {
          userId: req.params.userId,
          ts,
          salary: false,
          onlineDay,
          onlineMonth,
          pageTitle: "Thông tin giờ làm",
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      })
      .catch((err) => next(new Error(err)));
  }

  // [GET] /time/:userId/:month
  showMonth(req, res, next) {
    const page = +req.query.page || 1;
    let totalItems;
    let onlineDay;
    let onlineMonth;
    let totalOvertime = 0;
    let missTime = 0;
    let confirm;
    Timesheet.find({ userId: req.params.userId, month: req.params.month })
      .sortable(req)
      .countDocuments()
      .then((num) => {
        totalItems = num;
        return Timesheet.find({
          userId: req.params.userId,
          month: req.params.month,
        })
          .sortable(req)
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((ts) => {
        ts.map((e) => {
          e.items.map((i) => {
            if (i.endTime == undefined) {
              onlineDay = e.day;
              onlineMonth = e.month;
            }
          });
        });
        ts.map((e) => {
          if (e.confirm == false) {
            return (confirm = true);
          }
          totalOvertime += e.overTime;
          if (e.overTime == 0) {
            missTime += 8 - e.totalHours;
          }
        });

        User.findOne({ _id: req.params.userId })
          .then((user) => {
            res.render("mtimeInformation", {
              userId: req.params.userId,
              month: req.params.month,
              missTime,
              confirm,
              totalOvertime,
              salary: true,
              user,
              ts,
              onlineDay,
              onlineMonth,
              pageTitle: "Thông tin giờ làm",
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
          })
          .catch((err) => next(new Error(err)));
      })
      .catch((err) => next(new Error(err)));
  }

  // [GET] /fix
  fix(req, res, next) {
    Timesheet.findOne({
      userId: req.query.userId,
      day: req.query.day,
      month: req.query.month,
    })
      .then((ts) => {
        res.render("fix", {
          errorMessage: "",
          ts,
          pageTitle: "Sửa thông tin giờ làm",
          userId: req.query.userId,
        });
      })
      .catch((err) => next(new Error(err)));
  }

  // [Patch] /fixed
  fixed(req, res, next) {
    const errors = validationResult(req);

    Timesheet.findOne({
      userId: req.query.userId,
      day: req.query.day,
      month: req.query.month,
    })
      .then((ts) => {
        if (!errors.isEmpty()) {
          return res.status(422).render("fix", {
            ts,
            pageTitle: "Sửa thông tin giờ làm",
            userId: req.query.userId,
            errorMessage: errors.array()[0].msg,
          });
        }
        let i = -1;
        ts.items.map((e) => {
          i++;
          e.startTime = new Date(
            `2020,${req.body.month},${req.body.day},${req.body.startTime[i]}`
          );
          e.endTime = new Date(
            `2020,${req.body.month},${req.body.day},${req.body.endTime[i]}`
          );
          e.workplace = req.body.workplace[ts.items.indexOf(e)];

          e.hours = e.endTime.getHours() - e.startTime.getHours();
          if (e.hours > 8) {
            ts.overTime += e.hours - 8;
            e.hours = 8;
            ts.totalHours += e.hours;
          }
        });

        ts.save();
        res.redirect(`/manager/time/${ts.userId}`);
      })
      .catch((err) => next(new Error(err)));
  }

  // [Delete] /delete
  delete(req, res, next) {
    Timesheet.findOneAndDelete({
      userId: req.query.userId,
      month: req.query.month,
      day: req.query.day,
    })
      .then((ts) => {
        // res.json(ts);
        res.redirect(`/manager/time/${ts.userId}`);
      })
      .catch((err) => next(new Error(err)));
  }

  // [PUT] /time/:userId/confirm
  confirm(req, res, next) {
    Timesheet.updateMany(
      { uerId: req.query.userId, month: req.query.month },
      { confirm: true }
    )
      .then((ts) => {
        res.redirect(`/manager/time/${req.query.userId}/${req.query.month}`);
      })
      .catch((err) => next(new Error(err)));
  }
}

module.exports = new SiteController();

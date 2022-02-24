const Timesheet = require("../models/Timesheet");

const ITEMS_PER_PAGE = 20;

class TimeInformationController {
  //[GET] /
  show(req, res, next) {
    const page = +req.query.page || 1;
    let totalItems;
    let onlineDay;
    let onlineMonth;
    Timesheet.find({ userId: req.user._id })
      .countDocuments()
      .then((num) => {
        totalItems = num;
        return Timesheet.find({ userId: req.user._id })
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

        res.render("timeInformation", {
          user: req.user,
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

  // [GET] /:month
  showMonth(req, res, next) {
    const page = +req.query.page || 1;
    let totalItems;
    let onlineDay;
    let onlineMonth;
    let totalOvertime = 0;
    let missTime = 0;
    // let tsQuery =  Timesheet.find({ userId: req.user._id, month: req.params.month })
    Timesheet.find({ userId: req.user._id, month: req.params.month })
      .sortable(req)
      .countDocuments()
      .then((num) => {
        totalItems = num;
        return Timesheet.find({ userId: req.user._id, month: req.params.month })
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
          totalOvertime += e.overTime;
          if (e.overTime == 0) {
            missTime += 8 - e.totalHours;
          }
        });
        res.render("timeInformation", {
          month: req.params.month,
          missTime,
          totalOvertime,
          salary: true,
          user: req.user,
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
  }
}

module.exports = new TimeInformationController();

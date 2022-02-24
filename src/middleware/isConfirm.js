const Timesheet = require("../models/Timesheet");

module.exports = (req, res, next) => {
  // if (!req.session.logged) {
  //   return res.redirect("/login");
  // }
  // next();
  Timesheet.findOne({ userId: req.query.userId, month: req.query.month })
    .then((ts) => {
      if (ts.confirm) {
        return res.redirect("/");
      }
    })
    .catch((err) => console.log(err));

  next();
};

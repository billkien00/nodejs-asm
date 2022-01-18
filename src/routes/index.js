const attendanceRouter = require("./attendance");
const siteRouter = require("../routes/site");
const informationRouter = require("../routes/information");
const covidRouter = require("../routes/covid");
const timeInformationRouter = require('../routes/timeInformation')

function route(app) {
  app.use("/time-information", timeInformationRouter)
  app.use("/covid", covidRouter);
  app.use("/information", informationRouter);
  app.use("/attendance", attendanceRouter);
  app.use("/", siteRouter);
}

module.exports = route;

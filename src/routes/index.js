const attendanceRouter = require("./attendance");
const siteRouter = require("./site");
const informationRouter = require("./information");
const covidRouter = require("./covid");
const timeInformationRouter = require("./timeInformation");
const loginRouter = require("./login");
const managerRouter = require("./manager");
const errorController = require("../controllers/ErrorController");
const signupRouter = require("./signup");
const auth = require("../middleware/auth");
const staff = require("../middleware/staff");

function route(app) {
  app.use("/manager", managerRouter);

  app.use("/login", loginRouter);

  app.use("/signup", signupRouter);

  app.use("/time-information", auth, staff, timeInformationRouter);

  app.use("/covid", auth, covidRouter);

  app.use("/information", auth, staff, informationRouter);

  app.use("/attendance", auth, staff, attendanceRouter);

  app.use("/", siteRouter);

  app.use(errorController.get404);
}

module.exports = route;

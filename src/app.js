const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const moment = require("moment");

const route = require("./routes");
const db = require("./config/db");
const User = require("./models/User");

//connect to db
db.connect();

const app = express();
const port = 3000;

//get data from form data with method = 'post'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//method override để trả về put, path
app.use(methodOverride("_method"));

//truyền user đến request req.user
app.use((req, res, next) => {
  User.findById("61df4a0bddc48973bc0ff0ca")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//moment
app.locals.moment = require("moment");

//http logger
// app.use(morgan("combined"));
//template engine
// app.engine(
//   "hbs",
//   handlebars.engine({
//     extname: ".hbs",
//     helpers: {
//       compare: (a, b) => a > b,
//       date: (a) => moment(a).format("Do MMMM YYYY"),
//       time: (a) => moment(a).format("MMMM Do YYYY, h:mm:ss a"),
//       h: (a) => moment(a).format("LTS"),
//     },
//   })
// );

app.set("view engine", "ejs");
app.set("views", "src/resources/views");

//route init
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

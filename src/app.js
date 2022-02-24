const express = require("express");
const multer = require("multer");
const path = require("path");
const methodOverride = require("method-override");
const moment = require("moment");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const bodyParser = require("body-parser");

const sort = require("./middleware/sort");

const route = require("./routes");
const db = require("./config/db");
const User = require("./models/User");

const URI =
  "mongodb://funix-asm:beatboxermk1@cluster0-shard-00-00.pxgcj.mongodb.net:27017,cluster0-shard-00-01.pxgcj.mongodb.net:27017,cluster0-shard-00-02.pxgcj.mongodb.net:27017/nodejs-asm?ssl=true&replicaSet=atlas-1hoh29-shard-0&authSource=admin&retryWrites=true&w=majority";

//connect to db
db.connect();

const app = express();
const port = 3000;

//connect-mongodb-session : store
const store = new MongoDBStore({
  uri: URI,
  collection: "sessions",
});

// const csrfProtection = csrf();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.minetype === "image/png" ||
    file.minetype === "image/jpg" ||
    file.minetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "src/resources/views");

// express-sesion setting
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuth = req.session.logged;
  res.locals.isManager = req.session.manager;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use(bodyParser.urlencoded({ extended: false }));

//multer setting
app.use(multer({ storage }).single("image"));
app.use("/src/images", express.static(path.join(__dirname, "images")));

//method override để trả về put, path, delete
app.use(methodOverride("_method"));

//sort middleware
app.use(sort);

//get data from form data with method = 'post'
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//moment
app.locals.moment = require("moment");

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Lỗi",
  });
});

//http logger
// app.use(morgan("combined"));
//template engine

//route init
route(app);

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

app.listen(process.env.PORT || 8080, '0.0.0.0',()=>{
  console.log('Sever is running')
})
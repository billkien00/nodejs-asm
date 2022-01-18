const Covid = require("../models/Covid");

//từ bản update express handlebar 4.6 trở đi
//ko cho phép truy cập trực tiếp của các property qua đối tượng
const { mongooseToObject } = require("../util/mongoose");

class CovidController {
  //[Get] /
  show(req, res, next) {
    Covid.findOne({})
      .then((covid) => {
        res.render("covid", { covid: mongooseToObject(covid) });
      })
      .catch((err) => console.log(err));
  }

  //[PUT] /
  covidUpdated(req, res, next) {
    req.body.covid ? (req.body.covid = true) : (req.body.covid = false);
    Covid.findOneAndUpdate({}, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate before update
    })
      .then((covid) => {
        console.log(req.body.name1);
        if (covid !== null) {
          res.render("covid", { covid: mongooseToObject(covid) });
        } else {
          const cv = new Covid(req.body);
          cv.save().then(res.redirect("/covid"));
        }
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new CovidController();

const Covid = require("../models/Covid");
const { validationResult } = require("express-validator");

const moment = require("moment");

const fs = require("fs");

const path = require("path");

const PDFDocument = require("pdfkit");

class CovidController {
  //[Get] /
  show(req, res, next) {
    Covid.findOne({ userId: req.user._id })
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

  //[PUT] /
  covidUpdated(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Covid.findOne({ userId: req.user._id }).then((covid) => {
        return res
          .status(422)
          .render("covid", {
            covid,
            pageTitle: "Thông tin Covid",
            errorMessage: errors.array()[0].msg,
            oldInput: req.body,
            validationErrors: errors.array(),
          })
          .catch((err) => next(new Error(err)));
      });
    }
    req.body.covid ? (req.body.covid = true) : (req.body.covid = false);
    Covid.findOneAndUpdate({ userId: req.user._id }, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate before update
    })
      .then((covid) => {
        if (covid !== null) {
          res.render("covid", {
            covid,
            pageTitle: "Thông tin Covid",
            errorMessage: "",
            oldInput: [],
          });
        } else {
          req.body.userId = req.user._id;
          const cv = new Covid(req.body);
          cv.save().then(res.redirect("/covid"));
        }
      })
      .catch((err) => next(new Error(err)));
  }
  //[get] /covid/dowload
  download(req, res, next) {
    if (!req.user.manager) {
      Covid.findOne({ userId: req.user._id })
        .then((covid) => {
          const cname = "Covid-" + covid._id + ".pdf";
          const cpath = path.join("data", "covid", cname);

          const pdfDoc = new PDFDocument();
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            'inline; filename="' + cname + '"'
          );
          pdfDoc.pipe(fs.createWriteStream(cpath));
          pdfDoc.pipe(res);

          pdfDoc.fontSize(26).text("Thông tin Covid", {
            underline: true,
            align: "center",
          });
          pdfDoc
            .fontSize(12)
            .text(
              "updated at" + moment(covid.updatedAt).format("Do MMMM YYYY"),
              {
                align: "center",
              }
            );
          pdfDoc.text("Temperature :" + covid.temperature + "°C");
          pdfDoc.text("Mui 1: " + covid.name1);
          pdfDoc.text("Ngày: " + moment(covid.date1).format("Do MMMM YYYY"));
          pdfDoc.text("");
          pdfDoc.text("Mui 2: " + covid.name2);
          pdfDoc.text("Ngày: " + moment(covid.date2).format("Do MMMM YYYY"));
          if (covid.covid) {
            pdfDoc.text("have covid");
          } else {
            pdfDoc.text("no covid");
          }
          pdfDoc.end();
        })
        .catch((err) => next(err));
    }else{
      
    }
  }
}

module.exports = new CovidController();

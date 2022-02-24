const User = require("../models/User");
const fileHelper = require("../util/file");

//từ bản update express handlebar 4.6 trở đi
//ko cho phép truy cập trực tiếp của các property qua đối tượng

class InfomationController {
  //[GET] /
  show(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        res.render("information", {
          user,
          pageTitle: "Thông tin cá nhân",
          err: false,
          errorMessage: "Chưa chọn file ảnh",
        });
      })
      .catch((err) => next(new Error(err)));
  }

  //[GET] /update
  update(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        res.render("updateimg", { user, pageTitle: "Cập nhật ảnh cá nhân" });
      })
      .catch((err) => next(new Error(err)));
  }

  //[PUT] /update
  updated(req, res, next) {
    const image = req.file;
    if (!image) {
      return res.status(422).render("information", {
        user: req.user,
        pageTitle: "Thông tin cá nhân",
        err: true,
        errorMessage: "Chưa chọn file ảnh",
      });
    }
    fileHelper.deleteFile(req.user.image);
    User.findOneAndUpdate(
      { _id: req.user._id },
      { image: req.file.path },
      {
        new: true, // return updated doc
        runValidators: true, // validate before update
      }
    )
      .then((user) => {
        res.redirect("/information");
      })
      .catch((err) => next(new Error(err)));
  }
}

module.exports = new InfomationController();

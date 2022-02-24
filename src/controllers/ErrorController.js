class ErrorController {
  //[Get] /
  get404(req, res, next) {
    res.status(404).render("404", { pageTitle: "Lỗi: Không tìm thấy trang" });
  }
}

module.exports = new ErrorController();

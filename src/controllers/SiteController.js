class SiteController {
  //[GET] /
  home(req, res, next) {
    res.render("home", { pageTitle: "Trang chủ" });
  }
}

module.exports = new SiteController();

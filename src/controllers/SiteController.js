class SiteController {
  //[GET] /
  home(req, res, next) {
    res.render("home", { pageTitle: "Trang chủ" , isLogged:false});
  }
}

module.exports = new SiteController();

module.exports = (req, res, next) => {
  if (req.session.manager === true) {
    return res.redirect("/");
  }
  next();
};

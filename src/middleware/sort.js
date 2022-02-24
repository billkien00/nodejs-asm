module.exports = function sort(req, res, next) {
  res.locals._sort = {
    enabled: false,
    type: "asc",
  };

  if (req.query.hasOwnProperty("_sort")) {
    Object.assign(res.locals._sort, {
      enabled: true,
      type: req.query.type,
      field: req.query.field,
    });
  }
  next();
};

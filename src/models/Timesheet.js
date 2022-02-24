const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Timesheet = new Schema({
  day: { type: Number },
  month: { type: Number },
  items: [
    {
      startTime: { type: Date },
      endTime: { type: Date },
      workplace: { type: String },
      hours: { type: Number },
      annualLeaveTime: { type: Number },
    },
  ],
  totalHours: { type: Number },
  overTime: { type: Number },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  confirm: { type: Boolean },
});

//custom query helpers
Timesheet.query.sortable = function (req) {
  if (true && req.query.hasOwnProperty("_sort")) {
    const isValidtype = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.field]: isValidtype ? req.query.type : "asc",
    });
  }
  return this;
};

module.exports = mongoose.model("Timesheet", Timesheet);

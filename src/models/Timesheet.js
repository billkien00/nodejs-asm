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
    },
  ],
  totalHours: { type: Number },
  overTime: { type: Number },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Timesheet", Timesheet);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: { type: String, maxlength: 255 },
    doB: { type: Date },
    location: { type: String },
    salaryScale: { type: Number },
    startDate: { type: Date },
    department: { type: String },
    annualLeave: { type: Number },
    annualLeaveTime: { type: Number },
    image: { type: String },
    online: { type: Boolean },
    manager: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);

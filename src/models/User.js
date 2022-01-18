const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String, maxlength: 255 },
    doB: { type: Date },
    location: { type: String },
    salaryScale: { type: Number },
    startDate: { type: Date },
    department: { type: String },
    annualLeave: { type: Number },
    image: { type: String },
    online: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Covid = new Schema(
  {
    temperature: { type: String, required: true },
    name1: { type: String, required: true },
    date1: { type: Date, required: true },
    name2: { type: String, required: true },
    date2: { type: Date, required: true },
    covid: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Covid", Covid);

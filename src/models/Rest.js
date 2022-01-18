const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rest = new Schema({
  reason: { type: String, required: true },
  date: [],
  time: { type: Number, required: true },
});

module.exports = mongoose.model("Rest", Rest);

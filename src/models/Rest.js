const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rest = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  time: { type: Number, required: true },
  date: [],
});

module.exports = mongoose.model("Rest", Rest);

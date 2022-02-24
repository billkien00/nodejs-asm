const mongoose = require("mongoose");
const User = require("../../models/User");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb://funix-asm:beatboxermk1@cluster0-shard-00-00.pxgcj.mongodb.net:27017,cluster0-shard-00-01.pxgcj.mongodb.net:27017,cluster0-shard-00-02.pxgcj.mongodb.net:27017/nodejs-asm?ssl=true&replicaSet=atlas-1hoh29-shard-0&authSource=admin&retryWrites=true&w=majority"
    );
    console.log("connect successfully");
  } catch (error) {
    console.log("connect failure");
  }
}

module.exports = { connect };

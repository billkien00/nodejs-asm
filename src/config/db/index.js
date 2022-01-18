const mongoose = require("mongoose");
const User = require("../../models/User");

async function connect() {
  try {
    await mongoose
      .connect(
        "mongodb://funix-asm:beatboxermk1@cluster0-shard-00-00.pxgcj.mongodb.net:27017,cluster0-shard-00-01.pxgcj.mongodb.net:27017,cluster0-shard-00-02.pxgcj.mongodb.net:27017/nodejs-asm?ssl=true&replicaSet=atlas-1hoh29-shard-0&authSource=admin&retryWrites=true&w=majority"
      )
      .then(
        User.findOne({}).then((user) => {
          if (!user) {
            const user = new User({
              name: "Lê Minh Kiên",
              doB: 1998 - 01 - 17,
              annualLeave: 6,
              department: "it",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3E4JCfTlV_hablCFmfsJPkP6CX5i1y4O9yYhLYp_GOagl1Gyu6SHyofOevAAcpJ8fCas&usqp=CAU",
              location: "company",
              online: false,
              salaryScale: 8000,
            });
            user.save();
          }
        })
      )
      .catch();

    console.log("connect successfully");
  } catch (error) {
    console.log("connect failure");
  }
}

module.exports = { connect };

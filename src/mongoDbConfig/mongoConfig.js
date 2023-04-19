const mongoose = require("mongoose");
const connect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://dthanhff318:u24Au5j6JkGUoMDf@medical-sm.nkq3xqu.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        wtimeoutMS: 10000,
      }
    )
    .then(() => console.log("Connect DB success"))
    .catch((e) => console.log(e))
    .finally(() => {});
};

module.exports = connect;

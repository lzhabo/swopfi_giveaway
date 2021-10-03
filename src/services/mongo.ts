const mongoose = require("mongoose");

export const initMongo = () =>
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("\nConnected to MongoDB ✅  ");
    })
    .catch((err) => {
      console.log(process.env);
      console.log(process.env.MONGO_URL);
      console.log(
        `❌  MongoDB connection error. Please make sure MongoDB is running. ${err}`
      );
      // process.exit();
    });

import mongoose from "mongoose";
import "dotenv/config";

import app from "./app.js";

// const DB = process.env.DATABASE.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down");
  process.exit(1);
});

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected sucessfully"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app runnung on ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down");
  server.close(() => process.exit(1));
});

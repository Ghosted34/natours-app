import mongoose from "mongoose";
import Tour from "../../models/tourModel.js";
import User from "../../models/userModel.js";
import Review from "../../models/reviewModel.js";
import * as fs from "fs";

const DB =
  "mongodb+srv://ghosted34:<password>@natours.8n8kzjk.mongodb.net/?retryWrites=true&w=majority";

const DATABASE = DB.replace("<password>", "root123");
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected sucessfully"));

const tours = JSON.parse(fs.readFileSync("./tours.json", "utf-8"));
const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const reviews = JSON.parse(fs.readFileSync("./reviews.json", "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Loaded");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Deleted");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === "-import") {
  importData();
}
if (process.argv[2] === "-delete") {
  deleteData();
}

import express, { json } from "express";
import morgan from "morgan";
import tourRouter from "./natourRoutes/tourRoutes.js";
import userRouter from "./natourRoutes/userRoutes.js";

const app = express();

// Top Level Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(json());

app.use((req, res, next) => {
  req.requestTime = new Date().toUTCString();
  next();
});

// Route/Request
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// For Unhandled routes

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "No information found",
    message: `Cannot find ${req.originalUrl}`,
  });
});

// Export for server

export default app;

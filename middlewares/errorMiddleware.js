import AppError from "../utils/appErrors.js";

const handleObjectIdErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const { name } = err.keyValue;

  const message = `Duplicate field value: ${name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token. Please Login Again", 401);

const handleTokenExpiredError = () =>
  new AppError("Your session has expired. Please Login Again", 401);

const errorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
      error: err,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Uh-oh, Something went wrong",
    message: err.message,
  });
};
const errorProd = (err, req, res) => {
  // A1) Api site with known error
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // A2) Api site with unknown error

    return res.status(500).render("error", {
      status: "error",
      message: "Something went wrong!",
    });
  }

  //B1) Rendered site with known error
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Uh-oh, Something went wrong",
      message: err.message,
    });
  }
  // B2) Rendered site with unknown error
  return res.status(err.statusCode).render("error", {
    title: "Uh-oh, Something went wrong",
    message: "Please try again later.",
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    errorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.kind === "ObjectId") error = handleObjectIdErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error.message === "Validation failed" ||
      error.message === "User validation failed" ||
      error.message === "Tour Validation Failed"
    )
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    errorProd(error, req, res);
  }
};

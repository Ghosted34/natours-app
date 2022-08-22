import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel.js";

export const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in", 401));
  }

  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedData.id);

  if (!currentUser) return next(new AppError("User no longer exists", 401));

  if (currentUser.changedPasswordAfter(decodedData.iat))
    next(
      new AppError("Password was recently changed. Please Login In Again", 401)
    );

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      const decodedData = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decodedData.id);

      if (!currentUser) return next();

      if (currentUser.changedPasswordAfter(decodedData.iat)) return next();

      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      next(
        new AppError(
          "User does not have permission to access this reource",
          403
        )
      );
    next();
  };

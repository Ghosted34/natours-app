import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import { Email } from "../utils/email.js";

const filterObj = (obj, ...allowedFields) => {
  const permittedObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) permittedObj[el] = obj[el];
  });
  return permittedObj;
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

export const logout = (req, res) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now() + 10 * 1),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const signUp = catchAsync(async (req, res, next) => {
  const permittedBody = filterObj(
    req.body,
    "name",
    "email",
    "password",
    "passwordConfirm"
  );

  if (req.file) permittedBody.photo = req.file.filename;

  const user = await User.create(permittedBody);

  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url);
  await new Email(user, url).sendWelcome();

  sendToken(user, 201, res);
});

export const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password were provided
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  sendToken(user, 200, res);
});
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user)
    next(new AppError("There is no user with provided email address", 404));

  const resetToken = user.createResetToken();

  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/passwordReset/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch (error) {
    user.passwordResetToken = user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the token. Try again later"),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  //  Get user based on token
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired and user exists, set new password
  if (!user) next(new AppError("Token is invalid or has expired", 400));
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  sendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const { id } = req.user;
  const user = await User.findById(id).select("+password");
  if (!password) {
    return next(new AppError("Please provide password", 400));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Password", 401));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  sendToken(user, 200, res);
});

import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory.js";
import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new AppError("Not an image. Please upload only images", 400));
  }
  cb(null, true);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("photo");
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const userName = req.user
    ? `${req.user.id}`
    : `${req.body.name}`.split(" ")[0];
  req.file.filename = `user-${userName}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 85 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const permittedObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) permittedObj[el] = obj[el];
  });
  return permittedObj;
};

// User controllers
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "Password change not allowed here. Please use /update/password",
        400
      )
    );
  }

  const permittedBody = filterObj(req.body, "name", "email");

  if (req.file) permittedBody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, permittedBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

export const unSub = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    user: null,
  });
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
// Admin controllers
export const getAllUsers = getAll(User, "role");

export const getUser = getOne(User);

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined. Please sign up instead",
  });
};

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);

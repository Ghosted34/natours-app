import multer from "multer";
import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  unSub,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from "./../controllers/userController.js";

import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} from "../controllers/authControllers.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

// Auth Controller
router.post("/signup", uploadUserPhoto, resizeUserPhoto, signUp);
router.post("/signin", signIn);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/passwordReset/:token", resetPassword);

// User Controller
router.use(authenticate);
//
router.get("/me", getMe, getUser);
router.patch("/update/me", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/unsubscribe", unSub);
router.patch("/update/password", updatePassword);

// Admin Controller
router.use(authorize("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;

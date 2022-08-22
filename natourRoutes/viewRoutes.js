import { Router } from "express";
import { createBookingCheckout } from "../controllers/bookingController.js";
import {
  getAccount,
  getMyTours,
  getOverview,
  getTour,
  login,
  signup,
} from "../controllers/viewController.js";

import { authenticate, isLoggedIn } from "../middlewares/authMiddleware.js";

const router = Router();

router
  .get("/", createBookingCheckout, isLoggedIn, getOverview)
  .get("/overview", isLoggedIn, getOverview)
  .get("/home", isLoggedIn, getOverview);

router.get("/tours/:slug", isLoggedIn, getTour);

router.get("/login", login);
router.get("/signup", signup);
router.get("/me", authenticate, getAccount);
router.get("/bookings", authenticate, getMyTours);

export default router;

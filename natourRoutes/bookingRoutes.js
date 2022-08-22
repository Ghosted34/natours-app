import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getCheckoutSession } from "../controllers/bookingController.js";

const router = Router();

router.get("/checkout-session/:id", authenticate, getCheckoutSession);

export default router;

import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserId,
  updateReview,
} from "../controllers/reviewControllers.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router
  .route("/")
  .get(getAllReviews)
  .post(authorize("user"), setTourUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(authorize("user", "admin"), updateReview)
  .delete(authorize("user", "admin"), deleteReview);

export default router;

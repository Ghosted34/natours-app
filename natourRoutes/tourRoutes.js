import { Router } from "express";
import {
  getAllTours,
  getTourStats,
  yearlyTourStats,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getToursWithin,
  getDistances,
  uploadTourPhotos,
  resizeTourPhotos,
} from "./../controllers/tourController.js";

import {
  aliasAllPremium,
  aliasTopTours,
} from "../middlewares/tourMiddleware.js";

import { authenticate, authorize } from "../middlewares/authMiddleware.js";

import reviewRouter from "../natourRoutes/reviewRoutes.js";

const router = Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/all-premium").get(aliasAllPremium, getAllTours);

router
  .route("/tour-stats")
  .get(authenticate, authorize("admin", "lead-guide"), getTourStats);
router
  .route("/year-plan/:year")
  .get(authenticate, authorize("admin", "lead-guide"), yearlyTourStats);
router.route("/distances/:center/unit/:unit").get(getDistances);
router
  .route("/tours-within/:distance/center/:center/unit/:unit")
  .get(getToursWithin);

router
  .route("/")
  .get(getAllTours)
  .post(authenticate, authorize("admin", "lead-guide"), createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(
    authenticate,
    authorize("admin", "lead-guide"),
    uploadTourPhotos,
    resizeTourPhotos,
    updateTour
  )
  .delete(authenticate, authorize("admin", "lead-guide"), deleteTour);

export default router;

import { Router } from "express";
import {
  aliasTopTours,
  getAllTours,
  aliasAllPremium,
  getTourStats,
  yearlyTourStats,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from "./../controllers/tourController.js";

const router = Router();

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/all-premium").get(aliasAllPremium, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/year-plan/:year").get(yearlyTourStats);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;

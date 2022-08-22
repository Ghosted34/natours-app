import Review from "../models/reviewModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

export const getAllReviews = getAll(Review, "rating");

export const getReview = getOne(Review);

export const setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const createReview = createOne(Review);

export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);

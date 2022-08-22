import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";

export const getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  res.status(200).render("overview", {
    tours,
    title: "All Tours",
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("No Tour with that name", 404));
  }

  res.status(200).render("tour", {
    tour,
    title: tour.name,
  });
});

export const login = (req, res) => {
  res.status(200).render("authForm", {
    title: "Log in to your account",
    action: "Log in",
  });
};

export const signup = (req, res) => {
  res.status(200).render("authForm", {
    title: "Sign up today",
    url: "true",
    action: "Sign up",
  });
};

export const getAccount = (req, res) => {
  res.status(200).render("user", {
    title: "Your account",
  });
};

export const getMyTours = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourId = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourId } });
  res.status(200).render("overview", {
    title: "My tours",
    tours,
    booked: bookings ? true : false,
  });
};

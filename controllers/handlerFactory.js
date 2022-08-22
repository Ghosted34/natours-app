import AppError from "../utils/appErrors.js";
import { catchAsync } from "../utils/catchAsync.js";
import mongoose from "mongoose";
import APIFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Uh-oh,Document does not exist`, 404));
    }

    const doc = await Model.findById(id);
    if (!doc) return next(new AppError(`No Document found`, 404));
    const deletedDoc = await Model.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Uh-oh, Document does not exist", 404));
    }
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("Uh-oh, Document does not exist", 404));
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

export const getOne = (Model, popuOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Uh-oh, Tour does not exist", 404));
    }
    let query = Model.findById(id);

    if (popuOptions) query = query.populate(popuOptions);

    const doc = await query;

    if (!doc) return next(new AppError("Uh-oh, Tour does not exist", 404));

    res.status(200).json({
      status: "success",

      data: doc,
    });
  });

export const getAll = (Model, defSort) =>
  catchAsync(async (req, res, next) => {
    // For Reviews
    let filter = {};

    const { tourId } = req.params;

    if (tourId) filter = { tour: tourId };

    // Execute query
    const limit = req.query.limit * 1 || 3;
    const total = await Model.countDocuments({});
    const numberOfPages = Math.ceil(total / limit);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort(defSort)
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",

      numberOfPages,
      data: doc,
    });
  });

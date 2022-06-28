import Tour from "../models/tourModel.js";
import APIFeatures from "../utils/apiFeatures.js";

export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty,duration";
  next();
};

export const aliasAllPremium = (req, res, next) => {
  req.query.premium = true;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields =
    "name,price,ratingsAverage,summary,difficulty,premium,duration";

  next();
};

export const getAllTours = async (req, res) => {
  try {
    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: "success",
      result: tours.length,
      tours,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Post not found");
    }
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Post not found",
    });
  }
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Post not found");
    }
    const tour = await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      message: err,
    });
  }
};

export const getTourStats = async (req, res) => {
  const { ratingAvg } = req.params;
  try {
    const data = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: ratingAvg || 4.5 } },
      },
      {
        $group: {
          _id: null,
          numRatings: { $sum: "$ratingsQuantity" },
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      message: err,
    });
  }
};

export const yearlyTourStats = async (req, res) => {
  try {
    const { year } = req.params;

    const data = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTours: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      tourNumber: data.length,
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

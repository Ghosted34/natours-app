const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Build query

    // 1. Basic Filtering
    const queryObj = { ...req.query };
    const excludedObj = ['page', 'sort', 'limit', 'fields'];
    excludedObj.forEach((el) => delete queryObj[el]);

    // 2. Advanced Filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matched) => `$${matched}`
    );

    let query = Tour.find(JSON.parse(queryStr));

    // 3. Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-price');
    }

    // 4. Fields
    if (req.query.fields) {
      const selectBy = req.query.fields.split(',').join(' ');
      query = query.select(selectBy);
    } else {
      query = query.select('-__v');
    }

    // 5. Pagination(using pages and limits)
    const page = req.query.page * 1 || 1;
    const limitValue = req.query.limit * 1 || 3;

    const skipValue = (page - 1) * limitValue;

    query = query.skip(skipValue).limit(limitValue);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skipValue >= numTours) throw new Error('This page does not exist');
    }

    // Execute query

    const tours = await query;

    // const tours = await Tour.find();

    res.json({
      status: 'success',
      result: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      message: err,
    });
  }
};

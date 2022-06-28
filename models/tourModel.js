import mongoose from "mongoose";
import slugify from "slugify";

// Validators don't work on updates

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour nae must have equal or less than 40 charcaters"],
      minlength: [10, "A tour nae must have equal or less than 10 charcaters"],
    },
    duration: {
      type: Number,
      required: [true, "Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have group size"],
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price ? true : false;
        },
        message: "Discount price ({VALUE}) should be less than regular price ",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 3.5,
      min: [1, "Rating must above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      default: "easy",
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficult must be easy,medium or difficult",
      },
    },
    premium: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      required: [true, " A tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return (this.duration / 7).toPrecision(3);
});

// DOCUMENT MIDDLEWARE: runs before/after mongoose event[.save, .create,!.insertMany]
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE: runs before/after a query
tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });

  next();
});

// AGGREGATION MIDDLEWARE: runs before/after aggregation operation

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;

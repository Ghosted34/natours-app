import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      reqired: [true, "Booking must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      reqired: [true, "Booking must belong to a user"],
    },
    price: {
      type: Number,
      required: [true, "Booking must contai tour price"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "-__v -passwordChangedAt" }).populate({
    path: "tour",
    select: "name",
  });

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

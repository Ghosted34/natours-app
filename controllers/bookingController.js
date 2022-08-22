import Stripe from "stripe";
import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get currently booked tour
  const { id } = req.params;

  const tour = await Tour.findById(id);

  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary,
    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: tour.price * 100,
    currency: "usd",
  });

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${id}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: id,

    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  });

  // Create response
  res.status(200).json({
    status: "success",
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, price, user } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, price, user });

  res.redirect(`${req.protocol}://${req.get("host")}/bookings`);

  next();
});

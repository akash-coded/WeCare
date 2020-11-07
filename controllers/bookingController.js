const User = require("../models/user");
const Coach = require("../models/coach");
const Booking = require("../models/booking");
const { ErrorHandler } = require("../helpers/error");
const sanitize = require("mongo-sanitize");

exports.create_booking = (req, res, next) => {
  req.body.userId = req.params.userId;
  req.body.coachId = req.params.coachId;

  Booking.createOne(req.body, function (err, booking) {
    if (err && err.message) {
      let errorMessage = err.message.includes(":")
        ? err.message.split(":")[2].split(",")[0].trim()
        : err.message;
      return next(new ErrorHandler(errorMessage, 400));
    }
    res.status(200).send({
      message: true,
    });
  });
};

exports.fetch_coach_appointments = (req, res, next) => {
  Booking.find()
    .where("coachId")
    .eq(sanitize(req.params.coachId))
    .exec(function (err, bookings) {
      if (err) return next(new ErrorHandler(err));

      if (Array.isArray(bookings) && bookings.length === 0)
        return next(new ErrorHandler("Could not find any bookings", 400));

      res.status(200).json(bookings);
    });
};

exports.fetch_user_appointments = (req, res, next) => {
  Booking.find({ userId: new RegExp(req.params.userId, "i") }).exec(function (
    err,
    bookings
  ) {
    if (err) return next(new ErrorHandler(err));

    if (Array.isArray(bookings) && bookings.length === 0)
      return next(
        new ErrorHandler("Could not find any appointment details", 400)
      );

    res.status(200).json(bookings);
  });
};

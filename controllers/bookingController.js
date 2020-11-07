const Booking = require("../models/booking");
const { ErrorHandler } = require("../helpers/error");
const sanitize = require("mongo-sanitize");

exports.create_booking = (req, res, next) => {
  req.body.userId = req.params.userId;
  req.body.coachId = req.params.coachId;

  Booking.createOne(req.body, function (err, booking) {
    try {
      if (err && err.message) {
        let errorMessage = err.message.includes(":")
          ? err.message.split(":")[2].split(",")[0].trim()
          : err.message;
        throw new ErrorHandler(errorMessage, 400);
      }
      res.status(200).send({
        message: true,
      });
    } catch (e) {
      return next(e);
    }
  });
};

exports.update_booking = (req, res, next) => {
  req.body.bookingId = req.params.bookingId;

  Booking.findByBookingIdAndUpdate(req.body, function (err, booking) {
    try {
      if (err && err.message) {
        let errorMessage = err.message.includes(":")
          ? err.message.split(":")[2].split(",")[0].trim()
          : err.message;
        throw new ErrorHandler(errorMessage, 400);
      }

      if (!booking) throw new ErrorHandler("Booking Id does not exist", 400);

      res.status(200).send({
        message: true,
      });
    } catch (e) {
      return next(e);
    }
  });
};

exports.delete_booking = (req, res, next) => {
  Booking.deleteOne({ bookingId: sanitize(req.params.bookingId) }, function (
    err,
    result
  ) {
    try {
      if (err && err.message) {
        let errorMessage = err.message.includes(":")
          ? err.message.split(":")[2].split(",")[0].trim()
          : err.message;
        throw new ErrorHandler(errorMessage, 400);
      }

      if (!result.deletedCount)
        throw new ErrorHandler("Could not delete this appointment", 400);

      res.status(200).send({
        message: true,
      });
    } catch (e) {
      return next(e);
    }
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

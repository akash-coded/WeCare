const User = require("../models/user");
const Booking = require("../models/booking");
const { ErrorHandler } = require("../helpers/error");

exports.register_user = (req, res, next) => {
  User.createOne(req.body, function (err, user) {
    if (err && err.message) {
      let errorMessage = err.message.includes(":")
        ? err.message.split(":")[2].split(",")[0].trim()
        : err.message;
      return next(new ErrorHandler(errorMessage, 400));
    }
    res.status(201).send({
      message: user.userId,
    });
  });
};

exports.login_user = (req, res, next) => {
  User.findByUserId(req.body.id, function (err, user) {
    if (err && err.message) return next(new ErrorHandler(err));

    if (!user)
      return next(new ErrorHandler("Incorrect user id or password", 400));

    user.comparePassword(req.body.password, function (passwordErr, isMatch) {
      if (passwordErr) return next(new ErrorHandler(passwordErr));
      if (!isMatch)
        return next(new ErrorHandler("Incorrect user id or password", 400));
      res.status(200).send({
        message: true,
      });
    });
  });
};

exports.fetch_user_details = (req, res, next) => {
  User.findByUserId(req.params.userId, function (err, user) {
    if (err) return next(new ErrorHandler(err));

    if (!user) return next(new ErrorHandler("User id does not exist", 400));

    res.status(200).json(user);
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

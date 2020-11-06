const Coach = require("../models/coach");
const Booking = require("../models/booking");
const { ErrorHandler } = require("../helpers/error");
const sanitize = require("mongo-sanitize");

exports.register_coach = (req, res, next) => {
  Coach.createOne(req.body, function (err, coach) {
    if (err && err.message) {
      let errorMessage = err.message.includes(":")
        ? err.message.split(":")[2].split(",")[0].trim()
        : err.message;
      return next(new ErrorHandler(errorMessage, 400));
    }
    res.status(201).send({
      message: coach.coachId,
    });
  });
};

exports.login_coach = (req, res, next) => {
  Coach.findByCoachId(req.body.id, function (err, coach) {
    if (err && err.message) return next(new ErrorHandler(err));

    if (!coach || !req.body.password)
      return next(new ErrorHandler("Incorrect coach id or password", 400));

    coach.comparePassword(req.body.password, function (passwordErr, isMatch) {
      if (passwordErr) return next(new ErrorHandler(passwordErr));
      if (!isMatch)
        return next(new ErrorHandler("Incorrect coach id or password", 400));
      res.status(200).send({
        message: true,
      });
    });
  });
};

exports.fetch_coach_details = (req, res, next) => {
  Coach.findByCoachId(req.params.coachId, function (err, coach) {
    if (err) return next(new ErrorHandler(err));

    if (!coach) return next(new ErrorHandler("Coach id does not exist", 400));

    res.status(200).json(coach);
  });
};

exports.fetch_all_coaches = (req, res, next) => {
  Coach.find({}).exec((err, coaches) => {
    if (err) return next(new ErrorHandler(err));
    res.status(200).json(coaches);
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

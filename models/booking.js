const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const User = require("./user");
const Coach = require("./coach");
const { ErrorHandler } = require("../helpers/error");
const sanitize = require("mongo-sanitize");
const uniqueValidator = require("mongoose-unique-validator");

moment().format();

/// SCHEMA ///

const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
      trim: true,
      match: [/^(UI-000)\d$/, "User Id does not exist"],
      validate: {
        validator: function (v) {
          User.findOne()
            .byUserId(v)
            .exec((err, user) => {
              if (err) return next(new ErrorHandler(err));
              return user;
            });
        },
        message: "User Id does not exist",
      },
    },
    coachId: {
      type: String,
      required: [true, "Coach Id is required"],
      trim: true,
      match: [/^(CI-000)\d$/, "Coach Id does not exist"],
      validate: {
        validator: function (v) {
          Coach.findOne()
            .byCoachId(v)
            .exec((err, coach) => {
              if (err) return next(new ErrorHandler(err));
              return coach;
            });
        },
        message: "Coach Id does not exist",
      },
    },
    dateOfAppointment: {
      type: Date,
      required: [true, "Date is required"],
      min: [moment(), "Date should be any upcoming 7 days"],
      max: [moment().add(7, "days"), "Date should be any upcoming 7 days"],
    },
    slot: {
      type: String,
      required: [true, "Slot is required"],
      trim: true,
      match: [
        /^((1[012])|[1-9])\s(AM|PM|am|pm)\s(to)\s((1[012])|[1-9])\s(AM|PM|am|pm)$/,
        "Slot should be a valid one",
      ],
      validate: {
        validator: function (v) {
          const [from, to] = v.split(" to ");
          const fromHours = moment(from, ["h A"]).format("HH");
          const toHours = moment(to, ["h A"]).format("HH");

          return toHours > fromHours;
        },
        message: "Slot should be a valid one",
      },
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    runValidators: true,
    context: "query",
  }
);

/// VIRTUALS ///

bookingSchema.virtual("user", {
  ref: "User", // The model to use
  localField: "userId", // Find people where `localField`
  foreignField: "userId", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

bookingSchema.virtual("coach", {
  ref: "Coach", // The model to use
  localField: "coachId", // Find people where `localField`
  foreignField: "coachId", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

/// PLUGINS ///

bookingSchema.plugin(increment, {
  type: String,
  modelName: "Booking",
  fieldName: "bookingId",
  prefix: "B-000",
  start: 0,
  increment: 1,
});

/// STATICS ///

// Assign a function to the "statics" object of our animalSchema
bookingSchema.statics.createOne = function (data, callback) {
  return this.create(
    {
      userId: sanitize(data.userId),
      coachId: sanitize(data.coachId),
      dateOfAppointment: sanitize(data.dateOfAppointment),
      slot: sanitize(data.slot),
    },
    callback
  );
};

bookingSchema.statics.findByBookingIdAndUpdate = function (data, callback) {
  return this.findOneAndUpdate(
    {
      bookingId: sanitize(data.bookingId),
    },
    {
      dateOfAppointment: sanitize(data.dateOfAppointment),
      slot: sanitize(data.slot),
    },
    {
      new: true,
      runValidators: true,
    },
    callback
  );
};

/// MODEL HOOKS ///

bookingSchema.pre("validate", function (next) {
  const booking = this;

  if (!booking.isModified("slot")) return next();

  mongoose.models["Booking"]
    .find()
    .select({ slot: 1, _id: 0 })
    .and([
      { dateOfAppointment: booking.dateOfAppointment },
      { $or: [{ userId: booking.userId }, { coachId: booking.coachId }] },
    ])
    .exec(function (err, bookings) {
      if (err) return next(new ErrorHandler(err));

      if (Array.isArray(bookings) && bookings.length === 0) return next();

      const [start, end] = booking.slot.split(" to ");
      const startHours = moment(start, ["h A"]).format("HH");
      const endHours = moment(end, ["h A"]).format("HH");

      // converting array of JSON objects to array
      let slots = [];
      try {
        slots = bookings.reduce((acc, val) => [...acc, val.slot], []);
      } catch (e) {
        return next(e);
      }
      try {
        slots.forEach(function (value) {
          const [from, to] = value.split(" to ");
          const slotBeginning = moment(from, ["h A"]).format("HH");
          const slotEnding = moment(to, ["h A"]).format("HH");

          if (
            (startHours >= slotBeginning && startHours < slotEnding) ||
            (endHours > slotBeginning && endHours <= slotEnding) ||
            (startHours <= slotBeginning && endHours >= slotEnding)
          ) {
            throw new ErrorHandler(
              "There is an appointment in this slot already",
              400
            );
          }
        });

        return next();
      } catch (error) {
        return next(error);
      }
    });
});

module.exports = mongoose.model("Booking", bookingSchema);

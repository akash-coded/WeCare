const mongoose = require("mongoose");
const moment = require("moment");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const User = require("./user");
const Coach = require("./coach");
const { ErrorHandler } = require("../helpers/error");

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
        /^((1[12])|[1-9])\s(AM|PM|am|pm)\s(to)\s((1[12])|[1-9])\s(AM|PM|am|pm)$/,
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

/// SECONDARY INDEXES ///

bookingSchema.index(
  { coachId: 1, dateOfAppointment: 1, slot: 1 },
  { unique: true }
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

bookingSchema.plugin(uniqueValidator, {
  message: "Coach exists with this name",
});

bookingSchema.plugin(increment, {
  type: String,
  modelName: "Booking",
  fieldName: "bookingId",
  prefix: "B-000",
  start: 0,
  increment: 1,
});

module.exports = mongoose.model("Booking", bookingSchema);

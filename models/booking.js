const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const { User } = require("user");
const { Coach } = require("coach");
const moment = require("moment");

moment().format();

const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
      trim: true,
      match: [/^(UI-000)\d$/, "User Id does not exist"],
      validate: {
        validator: {
          function(v) {
            return User.findOne()
              .byUserId(v)
              .exec((err, user) => {
                return user;
              });
          },
        },
        message: (props) => "User Id does not exist",
      },
    },
    coachId: {
      type: String,
      required: [true, "Coach Id is required"],
      trim: true,
      match: [/^(CI-000)\d$/, "Coach Id does not exist"],
      validate: {
        validator: {
          function(v) {
            return Coach.findOne()
              .byCoachId(v)
              .exec((err, coach) => {
                return coach;
              });
          },
        },
        message: (props) => "Coach Id does not exist",
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
        validator: {
          function(v) {
            const [from, to] = v.split(" to ");
            const fromHours = moment(from, ["h A"]).format("HH");
            const toHours = moment(to, ["h A"]).format("HH");

            return toHours > fromHours;
          },
        },
        message: (props) => "Coach Id does not exist",
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

// secondary indexes
bookingSchema.index(
  { coachId: 1, dateOfAppointment: 1, slot: 1 },
  { unique: true }
);

// virtuals
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

// query helpers

// plugins
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

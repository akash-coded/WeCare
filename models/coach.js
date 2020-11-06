const mongoose = require("mongoose");
const moment = require("moment");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

moment().format();

/// SCHEMA ///

const coachSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      minlength: [3, "Name should have minimum 3 and maximum 50 characters"],
      maxlength: [50, "Name should have minimum 3 and maximum 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        5,
        "Password should have minimum 5 and maximum 10 characters",
      ],
      maxlength: [
        10,
        "Password should have minimum 5 and maximum 10 characters",
      ],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      enum: {
        values: ["F", "M"],
        message: "Gender should be either M or F",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"],
      min: [
        moment().subtract(100, "years"),
        "Age should be greater than 20 and less than 100",
      ],
      max: [
        moment().subtract(20, "years"),
        "Age should be greater than 20 and less than 100",
      ],
    },
    mobileNumber: {
      type: Number,
      required: [true, "Mobile Number is required"],
      min: [1000000000, "Mobile Number should have 10 digits"],
      max: [9999999999, "Mobile Number should have 10 digits"],
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
      trim: true,
      minlength: [10, "Specialty should have 10 to 50 characters"],
      maxlength: [50, "Specialty should have 10 to 50 characters"],
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

coachSchema.virtual("age").get(function () {
  return moment().diff(this.dateOfBirth, "years");
});

/// QUERY HELPERS ///

coachSchema.query.byCoachId = function (coachId) {
  return this.where({ coachId: new RegExp(coachId, "i") });
};

/// PLUGINS ///

coachSchema.plugin(uniqueValidator, {
  message: "Coach exists with this name",
});

coachSchema.plugin(increment, {
  type: String,
  modelName: "Coach",
  fieldName: "coachId",
  prefix: "CI-000",
  start: 0,
  increment: 1,
});

/// MODEL HOOKS ///

coachSchema.pre("save", function (next) {
  const coach = this;

  // only hash the password if it has been modified (or is new)
  if (!coach.isModified("password")) return next();

  bcrypt.hash(coach.password, saltRounds, function (err, hash) {
    if (err) return next(new ErrorHandler(err));
    // override the plaintext password with the hashed one
    coach.password = hash;
    next();
  });
});

module.exports = mongoose.model("Coach", coachSchema);

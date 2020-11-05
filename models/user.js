const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const moment = require("moment");

moment().format();

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name should have minimum 3 and maximum 50 characters"],
      maxlength: [50, "Name should have minimum 3 and maximum 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/[^@]+@[^\.]+\.com/, "Email should be a valid one"],
    },
    mobileNumber: {
      type: Number,
      required: [true, "Mobile Number is required"],
      min: [1000000000, "Mobile Number should have 10 digits"],
      max: [9999999999, "Mobile Number should have 10 digits"],
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is required"],
      min: [100000, "Pincode should have 6 digits"],
      max: [999999, "Pincode should have 6 digits"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [3, "City should have minimum 3 and maximum 20 characters"],
      maxlength: [20, "City should have minimum 3 and maximum 20 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [3, "State should have minimum 3 and maximum 20 characters"],
      maxlength: [20, "State should have minimum 3 and maximum 20 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [3, "Country should have minimum 3 and maximum 20 characters"],
      maxlength: [
        20,
        "Country should have minimum 3 and maximum 20 characters",
      ],
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

// create a virtual property `age` that's computed from `dateOfBirth`.
userSchema.virtual("age").get(function () {
  return moment().diff(this.dateOfBirth, "years");
});

// query helpers
userSchema.query.byUserId = function (userId) {
  return this.where({ userId: new RegExp(userId, "i") });
};

// plugins
userSchema.plugin(uniqueValidator, {
  message: "User exists with this email id",
});
userSchema.plugin(increment, {
  type: String,
  modelName: "User",
  fieldName: "userId",
  prefix: "UI-000",
  start: 0,
  increment: 1,
});

module.exports = mongoose.model("User", userSchema);

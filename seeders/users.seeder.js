import { Seeder } from "mongoose-data-seed";
import { User } from "../models/user";

const data = [
  {
    userId: "UI-0001",
    name: "Setna",
    password: "setna@123",
    dateOfBirth: "1996-01-01",
    gender: "F",
    mobileNumber: 1234567890,
    email: "setna@gmail.com",
    pincode: 123456,
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
  },
  {
    userId: "UI-0002",
    name: "Akash",
    password: "akash@123",
    dateOfBirth: "1996-05-21",
    gender: "M",
    mobileNumber: 8738498349,
    email: "akash@gmail.com",
    pincode: 765369,
    city: "Puri",
    state: "Odisha",
    country: "India",
  },
  {
    userId: "UI-0003",
    name: "Senna",
    password: "senna@123",
    dateOfBirth: "1976-01-01",
    gender: "M",
    mobileNumber: 9974748492,
    email: "senna@gmail.com",
    pincode: 420007,
    city: "Madrid",
    state: "COM",
    country: "Spain",
  },
  {
    userId: "UI-0004",
    name: "Clarkson",
    password: "jeremy@123",
    dateOfBirth: "1966-11-31",
    gender: "M",
    mobileNumber: 9999999999,
    email: "jeremy@clarkson.com",
    pincode: 456789,
    city: "London",
    state: "Greater London",
    country: "United Kingdom",
  },
  {
    userId: "UI-0005",
    name: "Trevor",
    password: "trevor@123",
    dateOfBirth: "1985-10-10",
    gender: "F",
    mobileNumber: 1234567890,
    email: "trevor@noah.com",
    pincode: 541278,
    city: "Johannesburg",
    state: "Gauten Province",
    country: "South Africa",
  },
];

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

export default UsersSeeder;

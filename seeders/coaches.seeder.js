import { Seeder } from "mongoose-data-seed";
import { Model } from "../server/models";

const data = [
  {
    coachId: "CI-0001",
    name: "John",
    password: "john@123",
    dateOfBirth: "1996-01-01",
    gender: "M",
    mobileNumber: 1234567890,
    speciality: "Depression Issues",
  },
  {
    coachId: "CI-0002",
    name: "Helena",
    password: "helena@123",
    dateOfBirth: "2001-01-01",
    gender: "F",
    mobileNumber: 1458456789,
    speciality: "Athleticism",
  },
  {
    coachId: "CI-0003",
    name: "Brock",
    password: "brock@123",
    dateOfBirth: "1996-12-22",
    gender: "M",
    mobileNumber: 7379365279,
    speciality: "Pokemon Training",
  },
];

class CoachesSeeder extends Seeder {
  async shouldRun() {
    return Model.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

export default CoachesSeeder;

import { Seeder } from "mongoose-data-seed";
import { Model } from "../server/models";

const data = [
  {
    bookingId: "B-0001",
    userId: "UI-0001",
    coachId: "CI-0001",
    slot: "10 AM to 11 AM",
    dateOfAppointment: "2020-09-04",
  },
  {
    bookingId: "B-0002",
    userId: "UI-0002",
    coachId: "CI-0002",
    slot: "10 AM to 11 AM",
    dateOfAppointment: "2020-09-05",
  },
  {
    bookingId: "B-0003",
    userId: "UI-0003",
    coachId: "CI-0003",
    slot: "10 AM to 11 AM",
    dateOfAppointment: "2020-09-06",
  },
  {
    bookingId: "B-0004",
    userId: "UI-0004",
    coachId: "CI-0001",
    slot: "11 AM to 12 PM",
    dateOfAppointment: "2020-09-04",
  },
  {
    bookingId: "B-0005",
    userId: "UI-0005",
    coachId: "CI-0002",
    slot: "1 PM to 2 PM",
    dateOfAppointment: "2020-09-05",
  },
];

class BookingsSeeder extends Seeder {
  async shouldRun() {
    return Model.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

export default BookingsSeeder;

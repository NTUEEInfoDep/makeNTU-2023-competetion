const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_HOST, MONGO_DBNAME, MONGO_URL } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ========================================

// const courseIDs = courses.map((course) => course.id);
// const selections = {};
// courseIDs.forEach((courseID) => {
//   selections[courseID] = [String];
// });

const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
    immutable: false,
  },
  teamName: {
    type: String,
    required: true,
    immutable: false,
  },
  authority: {
    type: Number,
    required: true,
    immutable: false,
  },
});

const Team = conn.model("Team", teamSchema);

// ========================================

module.exports = {
  Team,
  conn,
};

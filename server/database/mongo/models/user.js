const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const teamSchema = new mongoose.Schema({
  teamId: {
    type: Number,
    required: true,
    immutable: true,
  },
  status: {
    // -1: idle, 0: waiting, 1: using, 2: finished
    type: Number,
    required: true,
  },
  machine: {
    type: String,
    required: false,
  },
});

const Team = conn.model("User", teamSchema);

module.exports = {
  Team,
};

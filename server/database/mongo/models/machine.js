const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const MachineSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: Number }, // -1: idle, 0: waiting, 1: using, 2: finished
  duration: { type: Number, required: true },
  user: { type: String },
  completeTime: { type: Date },
});

const Machine = conn.model("Machine", MachineSchema);

const LaserCutterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  status: {
    type: Number, // 0: 準備中(click使用完成後), 1: 運行中(送出排程後)
    default: 0,
    required: true,
  },
  duration: {
    type: Number,
    default: 20,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
  completeTime: {
    type: String,
    required: false,
  },
});

const LaserCutterModel = conn.model("LaserCutter", LaserCutterSchema);

module.exports = {
  Machine,
  LaserCutterModel,
};

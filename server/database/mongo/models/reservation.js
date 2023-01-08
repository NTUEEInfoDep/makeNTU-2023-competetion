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

// 參賽組別借用雷切機的資訊
const ReserveLaserSchema = new mongoose.Schema(
  // 排到了就將 reserveStatus=0
  {
    teamId: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    thickness: {
      type: String,
      required: true,
    },
    reserveStatus: {
      type: Number, // 0:無預約 1:預約中--> 用在user介面 預約管理的功能(0/無資料:可預約; 1:可取消)
      default: 1, // creating reserve means reserveStatus=1
      required: true,
    },
  },
  // updated_at 決定排序先後，排序數值透過前端render table時的index計算
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ReserveLaserModel = conn.model("ReserveLaser", ReserveLaserSchema);

module.exports = {
  ReserveLaserModel,
};

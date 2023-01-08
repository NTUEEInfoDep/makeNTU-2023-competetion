const pubsub = require("./pubsub");
const Model = require("./database/mongo/models/machine");

class PoolList {
  constructor(interval = 1000) {
    this.poolList = {};
    this.userMap = new Map();
    this.pubsub = pubsub;
    this.interval = interval;
    this.setIntervalID = setInterval(async () => {
      await this.check();
    }, this.interval);
  }

  addUser(username, endtime) {
    this.poolList[username] = endtime;
  }

  async check() {
    const keys = Object.keys(this.poolList);
    for (let i = 0; i < keys.length; i++) {
      if (this.poolList[keys[i]] < Date.now()) {
        const machine = await Model.Machine.findOne({ name: keys[i] });
        machine.status = -1;
        machine.user = null;
        machine.completeTime = -1;
        await machine.save();
        delete this.poolList[keys[i]];
        const machines = await Model.Machine.find({});
        this.pubsub.publish("machineUpdated", { machineUpdated: machines });
        await Team.deleteOne({ machine: keys[i] });
        const users = await Team.find({});
        this.pubsub.publish("userUpdated", { userUpdated: users });
      }
    }
  }
}

const isMatch = (p1, p2) => {
  return p1 !== p2;
};

const pool = new PoolList();

module.exports = pool;

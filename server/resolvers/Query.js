const Model = require("../database/mongo/models/machine");
const { ReserveLaserModel } = require("../database/mongo/models/reservation");
const { Team } = require("../database/mongo/models/user");

const Query = {
  machine: async (parents, args, { pubsub }) => {
    const machines = await Model.Machine.find({});
    console.log(machines);
    // pubsub.publish("machineUpdated", { machineUpdated: machines });
    return machines;
  },
  user: async (parents, args, { pubsub }) => {
    const users = await Team.find({});
    console.log(users);
    // pubsub.publish("userUpdated", { userUpdated: users });
    return users;
  },

  laserCutter: async (parents, __, { req }) => {
    let laser = await Model.LaserCutterModel.find().sort({ id: 1 });
    console.log(laser);
    return laser;
  },

  laserCutterReservation: async (parents, __, { req }) => {
    let laserReservation = await ReserveLaserModel.find({
      reserveStatus: 1,
    }).sort({ updated_at: 1 });
    console.log(laserReservation);
    return laserReservation;
  },
};

module.exports = Query;

const Model = require("../database/mongo/models/machine");
const { ReserveLaserModel } = require("../database/mongo/models/reservation");
const { Team } = require("../database/mongo/models/user");

const Mutation = {
  // ======== 3DP ========
  createMachine: async (
    parent,
    { info: { name, type, duration } },
    { req, pubsub }
  ) => {
    // const user = await Model.UserModel.findOne({ id: req.session.userId });

    const machine = await new Model.Machine({
      name: name,
      type: type,
      status: -1,
      duration: duration,
      // user: user._id,
      completeTime: -1,
    }).save();
    const machines = await Model.Machine.find({});

    pubsub.publish("machineUpdated", { machineUpdated: machines });
    return machine;
  },
  clearMachine: async (parent, args, { pubsub }) => {
    await Model.Machine.deleteMany({});
    const machines = await Model.Machine.find({});
    pubsub.publish("machineUpdated", { machineUpdated: machines });
    await Team.updateMany({}, { $set: { status: 0 } });
    pubsub.publish("userUpdated", { userUpdated: await Team.find({}) });
    return "success";
  },
  deleteMachine: async (parent, { info: { name } }, { pubsub }) => {
    const machine = await Model.Machine.deleteOne({ name: name });
    const machines = await Model.Machine.find({});
    const user = await Team.findOne({ machine: name });
    if (user) {
      user.machine = "";
      user.status = 0;
      await user.save();
    }
    pubsub.publish("machineUpdated", { machineUpdated: machines });
    const users = await Team.find({});
    pubsub.publish("userUpdated", { userUpdated: users });
    return "success";
  },
  userReserveMachine: async (parent, { info: { teamId } }, { pubsub }) => {
    const team = await Team.findOne({ teamId: teamId });
    if (team) {
      return "you have already reserved a machine";
    }
    const user = await new Team({
      teamId: teamId,
      status: 0,
      machine: "",
    }).save();
    const users = await Team.find({});
    // console.log(users);
    pubsub.publish("userUpdated", { userUpdated: users });
    return "success";
  },
  userCancelMachine: async (parent, { info: teamId }, { pubsub }) => {
    const user = await Team.findOne({ teamId: teamId });
    console.log(teamId);
    if (user.status === 0) {
      await Team.deleteOne({ teamId: teamId });
      const users = await Team.find({});
      pubsub.publish("userUpdated", { userUpdated: users });
      return "success";
    } else if (user.status === 1) {
      const machine = await Model.Machine.findOne({ user: user._id });
      machine.status = -1;
      machine.user = null;
      machine.completeTime = -1;
      await machine.save();
      const machines = await Model.Machine.find({});
      pubsub.publish("machineUpdated", { machineUpdated: machines });
      await Team.deleteOne({ teamId: teamId });
      const users = await Team.find({});
      pubsub.publish("userUpdated", { userUpdated: users });
      return "success";
    }
  },
  adminUpdateUser: async (
    parent,
    { info: { teamId, status, machineName } },
    { pubsub, timer }
  ) => {
    const user = await Team.findOne({ teamId: teamId });
    if (status === 2) {
      const machine = await Model.Machine.findOne({ user: user.teamId });
      machine.status = -1;
      machine.user = null;
      machine.completeTime = -1;
      await machine.save();
      const machines = await Model.Machine.find({});
      pubsub.publish("machineUpdated", { machineUpdated: machines });
      await Team.deleteOne({ teamId: teamId });
      const users = await Team.find({});
      pubsub.publish("userUpdated", { userUpdated: users });
      return "success";
    } else {
      user.status = status;
      const machine = await Model.Machine.findOne({ name: machineName });
      machine.status = 1;
      machine.user = user.teamId;
      machine.completeTime = Date.now() + machine.duration * 60 * 1000;
      user.machine = machine.name;
      await user.save();
      await machine.save();
      const machines = await Model.Machine.find({});
      pubsub.publish("machineUpdated", { machineUpdated: machines });
      const users = await Team.find({});
      pubsub.publish("userUpdated", { userUpdated: users });
      return "success";
    }
  },
  adminCancelAllMachine: async (parent, args, { pubsub }) => {
    const machines = await Model.Machine.find({});
    for (let i = 0; i < machines.length; i++) {
      if (machines[i].status === 1) {
        machines[i].status = -1;
        machines[i].user = null;
        machines[i].completeTime = -1;
        await machines[i].save();
      }
    }
    const users = await Team.find({});
    for (let i = 0; i < users.length; i++) {
      if (users[i].status === 1) {
        await Team.deleteOne({ teamId: users[i].teamId });
      }
    }
    const newMachines = await Model.Machine.find({});
    pubsub.publish("machineUpdated", { machineUpdated: newMachines });
    return "success";
  },
  adminUpdateMachine: async (
    parent,
    { info: { name, status } },
    { pubsub }
  ) => {
    const machine = await Model.Machine.findOne({ name: name });
    machine.status = status;
    machine.user = null;
    machine.completeTime = -1;
    await machine.save();
    const machines = await Model.Machine.find({});
    pubsub.publish("machineUpdated", { machineUpdated: machines });
    await Team.deleteOne({ machine: name });
    const users = await Team.find({});
    pubsub.publish("userUpdated", { userUpdated: users });
    return "success";
  },
  adminClearUser: async (parent, args, { pubsub }) => {
    await Team.deleteMany({});
    const users = await Team.find({});
    pubsub.publish("userUpdated", { userUpdated: users });
    const machines = await Model.Machine.find({});
    for (let i = 0; i < machines.length; i++) {
      if (machines[i].status === 1) {
        machines[i].status = -1;
        machines[i].user = null;
        machines[i].completeTime = -1;
        await machines[i].save();
      }
    }
    const newMachines = await Model.Machine.find({});
    pubsub.publish("machineUpdated", { machineUpdated: newMachines });
    return "success";
  },
  updateAll: async (parent, args, { pubsub }) => {
    pubsub.publish("userUpdated", { userUpdated: await Team.find({}) });
    pubsub.publish("machineUpdated", {
      machineUpdated: await Model.Machine.find({}),
    });
    return "success update all";
  },

  // ======== Laser Cutter ========
  createLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    { pubsub }
  ) => {
    let laserCutter = await Model.LaserCutterModel.findOne({ id });
    if (!laserCutter) {
      console.log("LaserCutterModel不存在 -> 建立LaserCutterModel");
      // console.log({ id, status, duration, user, completeTime });
      laserCutter = await new Model.LaserCutterModel({
        id: id,
        status: status,
        duration: duration,
        user: user,
        completeTime: completeTime,
      }).save();
    } else {
      console.log("Find Current LaserCutter:", laserCutter.id);
    }

    console.log("Validation of LaserCutter:", laserCutter);

    pubsub.publish("LaserCutterInfo", { LaserCutterInfo: laserCutter });
    return laserCutter;
  },

  updateLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    { pubsub }
  ) => {
    let laserCutter = await Model.LaserCutterModel.findOneAndUpdate(
      { id },
      {
        $set: {
          status,
          duration,
          user,
          completeTime,
        },
      },
      { new: true }
    );

    if (!laserCutter) {
      console.log("Error LaserCutterModel不存在");
    } else {
      console.log("Update Current LaserCutter:", laserCutter.id);
    }
    console.log("Validation of LaserCutter:", laserCutter);
    pubsub.publish("LaserCutterInfo", { LaserCutterInfo: laserCutter });
    return laserCutter;
  },
  // delete laser cutter
  deleteLaserCutter: async (parents, { id }, { pubsub }) => {
    // Set status to '-1'.
    const laserCutter = await Model.LaserCutterModel.findOneAndDelete({ id });
    if (!laserCutter) {
      console.log("Error LaserCutterModel不存在");
    } else {
      console.log("Delete Current LaserCutter:", laserCutter.id);
    }
    console.log("Validation of LaserCutter:", laserCutter);
    pubsub.publish("LaserCutterInfo", { LaserCutterInfo: laserCutter });

    return "success";
  },

  // ======== Reserve Laser Cutter ========

  // for reserving a laser cutter
  createLaserReserve: async (
    parents,
    { info: { teamId, material, thickness } },
    { pubsub }
  ) => {
    // 曾經預約過-> 更新reserveStatus
    let reserveLaser = await ReserveLaserModel.findOneAndUpdate(
      { teamId },
      { material, thickness, reserveStatus: 1 },
      { new: true }
    );

    // 首次預約-> 創立預約紀錄
    if (!reserveLaser) {
      reserveLaser = await new ReserveLaserModel({
        teamId,
        material,
        thickness,
      }).save();

      console.log(
        "Create new Reservation record of LaserCutter:",
        reserveLaser
      );
    } else console.log("Find Reservation record of LaserCutter:", reserveLaser);
    pubsub.publish("LaserCutterReservation", {
      LaserCutterReservation: reserveLaser,
    });
    // console.log("Validation of LaserCutter:", reserveLaser);
    return reserveLaser;
  },

  // for canceling a laser cutter
  cancelLaserReserve: async (parents, { teamId }, { pubsub }) => {
    // 曾經預約過-> 更新reserveStatus
    let cancelLaser = await ReserveLaserModel.findOneAndUpdate(
      { teamId },
      { material: null, thickness: null, reserveStatus: 0 },
      { new: true }
    );

    if (!cancelLaser)
      console.log(`teamId ${teamId} didnt reserve a laser cutter!`);
    else console.log("Validation of cancelLaser:", cancelLaser);
    pubsub.publish("LaserCutterReservation", {
      LaserCutterReservation: cancelLaser,
    });
    return cancelLaser;
    // console.log("Validation of LaserCutter:", reserveLaser);
  },

  // 只是測是功能用
  clearLaserReserve: async (parent, __, { pubsub }) => {
    await ReserveLaserModel.deleteMany();
    return "success";
  },
};

module.exports = Mutation;

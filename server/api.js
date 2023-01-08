const uuid = require("node-uuid");

const express = require("express");
const session = require("express-session");
const asyncHandler = require("express-async-handler");
const redis = require("redis");
const connectRedis = require("connect-redis");
const bcrypt = require("bcrypt");
const deprecate = require("depd")("ntuee-course:api");
const mongoose = require("mongoose");
const constants = require("./constants");
const model = require("./database/mongo/model");
const { Machine } = require("./database/mongo/models/machine");

// ========================================

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

// ========================================

const router = express.Router();

const { REDIS_HOST, REDIS_PORT } = process.env;
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
redisClient.on("error", console.error);

const loginRequired = asyncHandler(async (req, res, next) => {
  if (!req.session.teamID) {
    res.status(403).end();
    return;
  }
  next();
});

const permissionRequired = (permission) =>
  asyncHandler(async (req, res, next) => {
    if (!req.session.authority || req.session.authority < permission) {
      res.status(403).end();
      return;
    }
    next();
  });
// ========================================

// ========================================
// Session middleware
const secret = uuid.v4();

const RedisStore = connectRedis(session);

const sessionOptions = {
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: null,
  },
  resave: false,
  saveUninitialized: false,
  secret,
  unset: "destroy",
  store: new RedisStore({
    client: redisClient,
    prefix: "ntuee-course-session:",
  }),
};

// clear all sessions in redis
sessionOptions.store.clear();

if (process.env.NODE_ENV === "production") {
  sessionOptions.cookie.secure = true; // Need https
  if (!sessionOptions.cookie.secure) {
    deprecate("Recommend to set secure cookie session if has https!\n");
  } else {
    console.log("Secure cookie is on");
  }
}

router.use(session(sessionOptions));
// ========================================

// ======================================== Machine API ========================================
router.post(
  "/machines",
  loginRequired,
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res, next) => {
    const { name, time } = req.body;
    console.log(name, time);
    const machine = new Machine({
      machineName: name.toString(),
      machineStatus: "idle",
      machineTime: time,
      machineUserID: "-1",
      machineLeftTime: 0,
    });
    await machine.save();
    res.status(200).end();
  })
);

router.get(
  "/people2machine",
  loginRequired,
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res) => {
    const { machineID, userID } = req.body;
    const machine = await Machine.find({ MachineName: machineID });
    machine.machineStatus = "using";
    machine.machineUserID = userID;
    machine.machineLeftTime = machine.machineTime;
    await machine.save();
    const machineList = await Machine.find({});
    res.status(200).json(machineList);
  })
);

router.get(
  "/machines",
  loginRequired,
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res) => {
    const machines = await Machine.find();
    console.log(machines);
    res.status(200).json(machines);
  })
);

router.delete(
  "/machines",
  loginRequired,
  asyncHandler(async (req, res) => {
    await Machine.deleteMany();
    res.status(200).end();
  })
);

router.delete(
  "/machines/:id",
  loginRequired,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Machine.deleteOne({
      MachineName: id,
    });
    res.status(200).end();
  })
);

// ======================================== Machine API End ========================================

// ======================================== Team API ========================================

router.get(
  "/teams",
  loginRequired,
  asyncHandler(async (req, res) => {
    const teams = await model.Team.find();
    res.status(200).json(teams);
  })
);

router.get(
  "/teams/:id",
  loginRequired,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const team = await model.Team.findOne({
      teamID: id,
    });
    res.status(200).json(team);
  })
);

router.post(
  "/teams",
  loginRequired,
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res) => {
    const { teamID, teamName, status } = req.body;
    const team = new model.Team({
      teamID,
      teamName,
      status,
    });
    await team.save();
    res.status(200).end();
  })
);

router.delete(
  "/teams",
  loginRequired,
  asyncHandler(async (req, res) => {
    await model.Team.deleteMany();
    res.status(200).end();
  })
);

router.delete(
  "/teams/:id",
  loginRequired,
  asyncHandler(async (req, res) => {
    const { teamID } = req.body;
    await model.Team.deleteOne({
      teamID: teamID,
    });
    res.status(200).end();
  })
);

router.post(
  "/teams/:id",
  loginRequired,
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res) => {
    const { teamID, teamName, status } = req.body;
    const team = await model.Team.findOne({
      teamID: teamID,
    });
    team.teamName = teamName;
    team.status = status;
    await team.save();
  })
);

// ======================================== Team API End ========================================

router
  .route("/session")
  .get(
    loginRequired,
    asyncHandler(async (req, res, next) => {
      res.status(200).send({
        teamID: req.session.teamID,
        authority: req.session.authority,
      });
    })
  )
  .post(
    express.urlencoded({ extended: false }),
    asyncHandler(async (req, res, next) => {
      let { teamID } = req.body;
      const { password } = req.body;

      if (!teamID || !password) {
        res.status(400).end();
        return;
      }
      teamID = teamID.toUpperCase();

      const user = await model.Team.findOne({ teamID }).exec();
      if (!user) {
        res.status(400).end();
        return;
      }
      const passwordHash = user.password;
      const { teamName } = user;
      const { authority } = user;

      // Check password with the passwordHash
      const match = await bcrypt.compare(password, passwordHash);
      if (!match) {
        res.status(401).end();
        return;
      }

      req.session.teamID = teamID;
      req.session.teamName = teamName;
      req.session.authority = authority;
      res.status(200).send({ teamID, authority });
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      req.session = null;
      res.status(204).end();
    })
  );

router.route("/password").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    let ERROR_INPUT = false;
    mongoose.set("useFindAndModify", false);

    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }

    // check input type
    modifiedData.forEach((data) => {
      // check if attribute teamID,new_password exist
      if (!data.teamID || !data.new_password) {
        ERROR_INPUT = true;
      }
      // check if input is string
      if (
        typeof data.new_password !== "string" ||
        typeof data.teamID !== "string"
      ) {
        ERROR_INPUT = true;
      }
    });
    if (ERROR_INPUT) {
      res.status(400).end();
      return;
    }

    await Promise.all(
      modifiedData.map(async (data) => {
        const salt = await bcrypt.genSalt(constants.SALT_ROUNDS);
        const newpasswordHash = await bcrypt.hash(data.new_password, salt);
        const filter = { teamID: data.teamID.toUpperCase() };
        const update = { password: newpasswordHash };
        const result = await model.Team.findOneAndUpdate(filter, update);
      })
    );

    res.status(204).end();
  })
);

router
  .route("/users")
  .get(
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const teamGroup = await model.Team.find({}).exec();
      const filtered = [];
      const items = Object.keys(req.query);
      let pass = true;
      teamGroup.forEach((team) => {
        const filteredteam = {};
        filteredteam.id = team.teamID;
        items.forEach((item) => {
          if (item === "password") {
            pass = false;
          }
          filteredteam[item] = team[item];
        });
        filtered.push(filteredteam);
      });
      if (!pass) {
        res.status(403).end();
        return;
      }
      res.send(filtered);
    })
  )
  .post(
    express.json({ extended: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const teamsRaw = req.body;
      const teams = [];
      let cnt = 0;
      let pass = true;
      if (!teamsRaw || !Array.isArray(teamsRaw)) {
        res.status(400).end();
        return;
      }
      teamsRaw.forEach((teamRaw) => {
        if (
          typeof teamRaw.authority !== "number" ||
          typeof teamRaw.teamID !== "string" ||
          typeof teamRaw.password !== "string" ||
          typeof teamRaw.teamName !== "string"
        ) {
          pass = false;
        }
      });
      if (!pass) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        teamsRaw.map(async (teamRaw) => {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(teamRaw.password, salt);
          const team = { ...teamRaw };
          team.password = hash;
          team.teamID = team.teamID.toUpperCase();
          const match = await model.Team.findOne({
            teamID: team.teamID,
          }).exec();
          if (!match) {
            cnt += 1;
            teams.push(team);
          }
        })
      );
      console.log("All passwords are hashed!");
      // Save all teams
      await Promise.all(
        teams.map(async (team) => {
          const teamDocument = new model.Team(team);
          await teamDocument.save();
        })
      );
      console.log(`Successfully update ${cnt} teams`);
      res.status(204).end();
    })
  )
  .delete(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const deleteData = req.body;
      const deleteData_new = [];
      if (!deleteData || !Array.isArray(deleteData)) {
        res.status(400).end();
        return;
      }
      deleteData.forEach((teamID) => {
        if (typeof teamID === "string") {
          deleteData_new.push(teamID);
        }
      });
      await Promise.all(
        deleteData_new.map(async (data) => {
          const teamID = data.toUpperCase();
          const team = await model.Team.findOne({ teamID }).exec();
          if (team) {
            await model.Team.deleteOne({ teamID });
          }
        })
      );
      res.status(204).end();
    })
  )
  .put(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const modifiedData = req.body;
      const modifiedData_new = [];
      if (!modifiedData || !Array.isArray(modifiedData)) {
        res.status(400).end();
        return;
      }
      // if the element in addData is not a valid Course type, remove it from addData
      modifiedData.forEach((data) => {
        if (typeof data.teamID === "string") {
          modifiedData_new.push(data);
        }
      });
      await Promise.all(
        modifiedData_new.map(async (data) => {
          let { teamID } = data;
          const { authority } = data;
          let { password } = data;
          const { teamName } = data;
          const salt = await bcrypt.genSalt(10);
          teamID = teamID.toUpperCase();
          const team = await model.Team.findOne({ teamID }).exec();
          if (team) {
            if (password) {
              const hash = await bcrypt.hash(password, salt);
              password = hash;
              await model.Team.updateOne(
                {
                  teamID,
                },
                {
                  authority,
                  password,
                  teamName,
                }
              );
            } else {
              await model.Team.updateOne(
                {
                  teamID,
                },
                {
                  authority,
                  teamName,
                }
              );
            }
          }
        })
      );
      res.status(204).end();
    })
  );

router.route("/authority").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    const modifiedData_new = [];
    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }
    console.log(modifiedData);
    modifiedData.forEach((data) => {
      if (
        typeof data.teamID === "string" &&
        typeof data.authority === "number"
      ) {
        modifiedData_new.push(data);
      }
    });
    await Promise.all(
      modifiedData_new.map(async (data) => {
        let { teamID } = data;
        const { authority } = data;
        teamID = teamID.toUpperCase();
        const user = await model.Team.findOne({ teamID }).exec();
        if (user) {
          await model.Team.updateOne({ teamID }, { authority });
        }
      })
    );
    res.status(204).end();
  })
);

module.exports = {
  router,
  loginRequired,
};

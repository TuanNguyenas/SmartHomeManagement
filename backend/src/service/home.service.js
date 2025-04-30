"use strict";

const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const { getDevicesBySerialNumber } = require("../dbs/repositories/device.repo");
const {
  getHomeByUserId,
  addUserToHomeById,
  updateManagerByHomeId,
  getHomeByHomeId,
  getHomeBySerialNumber,
  removeUserFromHomeById,
} = require("../dbs/repositories/home.repo");

const {
  getMeasurementByHomeId,
} = require("../dbs/repositories/measurement.repo");
const { getUserByEmail } = require("../dbs/repositories/user.repo");

class HomeService {
  static async getHomeByUserId({ userId }) {
    const result = await getHomeByUserId(userId);
    if (!result) {
      throw new BadRequestError("Home not found");
    }

    return {
      status: 200,
      result,
    };
  }

  static async addUserToHomeById({ userEmail, homeId }) {
    const foundUser = await getUserByEmail(userEmail);

    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    const foundHome = await getHomeByUserId(foundUser.id);
    if (foundHome.home_id === homeId) {
      throw new ConflictRequestError("User already in home");
    }

    const result = await addUserToHomeById(foundUser.id, homeId);
    if (!result) {
      throw new BadRequestError("Home not found");
    }

    const home = await getHomeByHomeId(homeId);

    if (!home.manager_id) {
      const temp = await updateManagerByHomeId(userId, homeId);
      if (!temp) {
        throw new BadRequestError("Error during add manager");
      }
    }
    return {
      status: 200,
      message: "Add User Successfully",
    };
  }

  static async removeUserFromHomeById({ userId, homeId }) {
    const result = await removeUserFromHomeById(userId, homeId);
    if (!result) {
      throw new BadRequestError("Remove failed");
    }
    return {
      status: 200,
      message: "Remove Successfully",
    };
  }

  static async getHomeBySerialNumber({ serialNumber }) {
    const result = await getHomeBySerialNumber(serialNumber);
    if (!result) {
      throw new BadRequestError("Home not found");
    }

    const devices = await getDevicesBySerialNumber(serialNumber);

    return {
      status: 200,
      message: "Get home successfully",
      home: { ...result, devices: devices },
    };
  }

  static async getMeasurementByHomeId({ home_id }) {
    const result = await getMeasurementByHomeId(home_id);
    if (!result) {
      throw new BadRequestError("Home not found");
    }

    return {
      status: 200,
      result: result,
    };
  }
}

module.exports = HomeService;

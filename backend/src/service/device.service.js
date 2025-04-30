"use strict";

const {
  NotFoundError,
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");

const {
  getDeviceById,
  getDevicesBySerialNumber,
  updateDeviceStatus,
} = require("../dbs/repositories/device.repo");
const {
  getHomeByUserId,
  getHomeBySerialNumber,
} = require("../dbs/repositories/home.repo");
const {
  findExistingOpenLog,
  createLogEvent,
  findLatestOnLog,
  updateLogEvent,
} = require("../dbs/repositories/logevent.repo");
const { upsertMeasurement } = require("../dbs/repositories/measurement.repo");

class DeviceService {
  static getAllDevices = async ({ serial_number }) => {
    const devices = await getDevicesBySerialNumber(serial_number);
    if (!devices || devices.length === 0) {
      throw new NotFoundError("No devices found");
    }

    return {
      message: "Get devices successfully",
      metadata: devices,
    };
  };

  static getDeviceById = async ({ device_id }) => {
    const device = await getDeviceById(device_id);
    if (!device) {
      throw new NotFoundError("Device not found");
    }

    return {
      message: "Get device successfully",
      metadata: device,
    };
  };

  static updateDeviceStatus = async ({ device_id, status }) => {
    const updatedDevice = await updateDeviceStatus(device_id, status);
    if (!updatedDevice) {
      throw new ConflictRequestError("Failed to update device status");
    }

    const home = await getHomeBySerialNumber(updatedDevice.serial_number);

    console.log(
      `https://io.adafruit.com/api/v2/${home.home_name}/feeds/${updatedDevice.feed}/data?x-aio-key=${home.aio_key}`
    );

    const response = await fetch(
      `https://io.adafruit.com/api/v2/${home.home_name}/feeds/${updatedDevice.feed}/data?x-aio-key=${home.aio_key}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: status === "on" ? 1 : 0,
        }),
      }
    );

    if (!response.ok) {
      throw new BadRequestError("Error update status to Adafruit");
    }

    if (status === "on") {
      const existingOpenLog = await findExistingOpenLog(device_id);
      if (!existingOpenLog) {
        await createLogEvent(device_id);
      }
    } else if (status === "off") {
      const latestOnLog = await findLatestOnLog(device_id);
      if (latestOnLog) {
        const timeOut = new Date();
        const durationHours =
          (timeOut.getTime() - latestOnLog.time_in.getTime()) / (1000 * 3600);
        const device = await getDeviceById(device_id);
        const powerRating = parseFloat(device.power_rating);

        const newConsumption = powerRating * durationHours;
        const monthStart = new Date(timeOut.getFullYear(), timeOut.getMonth());

        await upsertMeasurement(
          durationHours,
          newConsumption,
          device_id,
          monthStart
        );
        await updateLogEvent(latestOnLog.id, timeOut);
      }
    }

    return {
      message: "Update device status successfully",
      metadata: updatedDevice,
    };
  };

  static async getDevicesByUserId({ userId }) {
    const foundHome = await getHomeByUserId(userId);
    if (!foundHome) {
      throw new BadRequestError("Home not found");
    }

    const foundDevice = await Promise.all(
      foundHome.map(async (home) => {
        const devices = await getDevicesBySerialNumber(home.home.serial_number);
        return {
          home_id: home.home_id,
          home_name: home.home.home_name,
          serial_number: home.home.serial_number,
          aio_key: home.home.aio_key,
          manager_id: home.home.manager_id,
          devices: devices,
        };
      })
    );

    return foundDevice;
  }
}
module.exports = DeviceService;

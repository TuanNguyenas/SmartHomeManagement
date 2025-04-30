"use strict";

const {
  createSchedule,
  getSchedule,
  getScheduleByDevice,
  updateDeviceSchedule,
  deleteScheduleByDevice,
  activateSchedule,
} = require("../dbs/repositories/schedule.repo");

const { getDeviceById } = require("../dbs/repositories/device.repo");
const {
  NotFoundError,
  ConflictRequestError,
} = require("../core/error.response");
const { addJob, removeJob } = require("../cron/cronScheduler");

class ScheduleService {
  static createSchedule = async ({
    device_id,
    action_time,
    action_day,
    action,
    value,
  }) => {
    if (
      !device_id ||
      !action_time ||
      !action_day ||
      !action ||
      (action == "on" && !value)
    ) {
      throw new Error("Missing required fields");
    }
    if (!value) value = 0;
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");
    const history = await getSchedule({
      device_id,
      action_day,
      action_time: new Date(action_time),
    });
    if (history) {
      throw new ConflictRequestError(
        "Schedule'device already exists for this time"
      );
    }
    const schedule = await createSchedule({
      device_id,
      action_time: new Date(action_time),
      action_day,
      action,
      value,
    });
    if (!schedule) throw new ConflictRequestError("Failed to create schedule");

    addJob(action_day, action_time, device_id, value);

    return {
      message: "Schedule created successfully",
      metadata: schedule,
    };
  };

  static getSchedule = async ({ device_id, action_time, action_day }) => {
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");

    const schedule = await getSchedule(device_id, action_time, action_day);
    if (!schedule) throw new NotFoundError("Schedule not found");

    return {
      message: "Get schedule successfully",
      metadata: schedule,
    };
  };

  static getScheduleByDevice = async ({ device_id }) => {
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");
    const schedules = await getScheduleByDevice(device_id);
    if (!schedules || schedules.length === 0) {
      return {
        message: "No schedule found",
        metadata: [],
      };
    }
    const groupedSchedules = {};
    schedules.forEach((schedule) => {
      const { action_time, action_day, action, device_id, value, is_enable } =
        schedule;
      const timePart = action_time.toISOString().split("T")[1].substring(0, 5);
      const key = `${device_id}-${timePart}-${action}`;
      if (!groupedSchedules[key]) {
        groupedSchedules[key] = {
          device_id: device_id,
          action_time: action_time,
          action: action,
          action_days: [],
          value: value,
          is_enable: is_enable,
        };
      }
      if (!groupedSchedules[key].action_days.includes(action_day)) {
        groupedSchedules[key].action_days.push(action_day);
      }
    });

    const result = Object.values(groupedSchedules);

    return {
      message: "Get schedules successfully",
      metadata: result,
    };
  };

  static updateSchedule = async ({
    device_id,
    action_day,
    action_time,
    action,
    action_day_old,
    action_time_old,
    value,
    is_enable,
  }) => {
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");

    const schedule = await getSchedule({
      device_id,
      action_time: action_time_old,
      action_day: action_day_old,
    });
    if (!schedule) throw new NotFoundError("Schedule not found");

    const updatedSchedule = await updateDeviceSchedule({
      device_id,
      action_time: new Date(action_time),
      action_day,
      action,
      action_time_old: new Date(action_time_old),
      action_day_old,
      value,
      is_enable,
    });
    if (!updatedSchedule)
      throw new ConflictRequestError("Failed to update schedule");

    const name = `${device_id}.${
      updatedSchedule.action_day
    }.${updatedSchedule.action_time.toISOString().slice(11, 19)}`;
    removeJob(name);
    addJob(action_day, action_time, device_id, value);
    return {
      message: "Schedule updated successfully",
      metadata: updatedSchedule,
    };
  };

  static activateSchedule = async ({
    device_id,
    is_enable,
    action_time,
    action_day,
  }) => {
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");

    const schedule = await getSchedule({
      device_id,
      action_time,
      action_day,
    });

    if (!schedule) throw new NotFoundError("Schedule not found");

    const updatedSchedule = await activateSchedule({
      device_id,
      action_day,
      action_time,
      is_enable,
    });
    if (!updatedSchedule)
      throw new ConflictRequestError("Failed to update schedule");

    const name = `${device_id}.${
      updatedSchedule.action_day
    }.${updatedSchedule.action_time.toISOString().slice(11, 19)}`;

    if (updatedSchedule.is_enable) {
      addJob(
        updatedSchedule.action_day,
        updatedSchedule.action_time,
        device_id,
        updatedSchedule.value
      );
    } else {
      removeJob(name);
    }
    return {
      message: "Schedule updated successfully",
      metadata: updatedSchedule,
    };
  };

  static deleteScheduleByDevice = async ({
    device_id,
    action_time,
    action_day,
  }) => {
    const device = await getDeviceById(device_id);
    if (!device) throw new NotFoundError("Device not found");

    const schedule = await getSchedule({ device_id, action_time, action_day });
    if (!schedule) throw new NotFoundError("Schedule not found");

    await deleteScheduleByDevice(device_id, action_time, action_day);
    const name = `${device_id}.${action_day}.${schedule.action_time
      .toISOString()
      .slice(11, 19)}`;
    removeJob(name);
    return { message: "Schedule deleted successfully" };
  };
}

module.exports = ScheduleService;

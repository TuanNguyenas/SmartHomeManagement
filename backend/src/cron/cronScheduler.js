"use strict";

const cron = require("node-cron");
const { getAllSchedule } = require("../dbs/repositories/schedule.repo");
const { sendMessage } = require("../utils/SendMessage");
const { getDeviceById } = require("../service/device.service");
const { getHomeBySerialNumber } = require("../dbs/repositories/home.repo");

let jobs = new Map();

const daysOfWeek = {
  everyday: "*",
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const initCronJobs = async () => {
  try {
    const schedules = await getAllSchedule();
    schedules.forEach(async (schedule) => {
      const deviceResponse = await getDeviceById({
        device_id: schedule.device_id,
      });
      const homeResponse = await getHomeBySerialNumber(
        deviceResponse.metadata.serial_number
      );
      const date = new Date(schedule.action_time);
      const time = `${date.getMinutes()} ${date.getHours()} * * ${
        daysOfWeek[schedule.action_day]
      }`;
      const job = cron.schedule(
        time,
        () =>
          sendMessage(
            deviceResponse,
            homeResponse,
            schedule.device_id,
            schedule.value
          ),
        { scheduled: true }
      );
      const name = `${schedule.device_id}.${schedule.action_day}.${date
        .toISOString()
        .slice(11, 19)}`;
      jobs.set(name, job);
    });
  } catch (error) {
    console.error(error);
  }
};

const addJob = async (action_day, action_time, device_id, value) => {
  try {
    const deviceResponse = await getDeviceById({ device_id });
    const homeResponse = await getHomeBySerialNumber(
      deviceResponse.metadata.serial_number
    );
    const date = new Date(action_time);
    const time = `${date.getMinutes()} ${date.getHours()} * * ${
      daysOfWeek[action_day]
    }`;
    const job = cron.schedule(
      time,
      () =>
        sendMessage(deviceResponse, homeResponse, device_id, value).then(() => {
          console.log("Send Message Succesfully");
        }),
      { scheduled: true }
    );
    const name = `${device_id}.${action_day}.${date
      .toISOString()
      .slice(11, 19)}`;
    jobs.set(name, job);
  } catch (error) {
    console.error(error);
  }
};

const removeJob = async (name) => {
  const job = jobs.get(name);
  if (job) {
    job.stop();
    jobs.delete(name);
  }
};

const updateJob = async (action_day, action_time, device_id, value) => {
  const date = new Date(action_time);
  const timePart = date.toISOString().slice(11, 19);
  const name = `${device_id}.${action_day}.${timePart}`;
  await removeJob(name);
  await addJob(action_day, action_time, device_id, value);
};

const getJobByDeviceId = async (device_id) => {
  const deviceJobs = [];
  for (const [name, job] of jobs.entries()) {
    if (name.startsWith(`${device_id}.`)) {
      deviceJobs.push({ name, job });
    }
  }
  return deviceJobs;
};

module.exports = {
  initCronJobs,
  addJob,
  removeJob,
  updateJob,
  getJobByDeviceId,
};

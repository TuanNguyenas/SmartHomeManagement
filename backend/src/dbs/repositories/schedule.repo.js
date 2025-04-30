const prisma = require("../init.prisma");

const createSchedule = async (schedule) => {
  return await prisma.schedule.create({
    data: {
      device_id: schedule.device_id,
      action_time: new Date(schedule.action_time), // Đảm bảo kiểu DateTime
      action_day: schedule.action_day,
      action: schedule.action,
      value: schedule.value,
    },
  });
};

const getScheduleByDevice = async (device_id) => {
  const result = await prisma.schedule
    .findMany({
      where: {
        device_id: device_id,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const updateDeviceSchedule = async (schedule) => {
  const result = await prisma.schedule
    .update({
      where: {
        action_time_device_id_action_day: {
          action_time: new Date(schedule.action_time_old),
          device_id: schedule.device_id,
          action_day: schedule.action_day_old,
        },
      },
      data: {
        action: schedule.action,
        action_time: new Date(schedule.action_time),
        action_day: schedule.action_day,
        value: schedule.value,
        is_enable: is_enable,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const activateSchedule = async (schedule) => {
  const result = await prisma.schedule
    .update({
      where: {
        action_time_device_id_action_day: {
          action_time: new Date(schedule.action_time),
          device_id: schedule.device_id,
          action_day: schedule.action_day,
        },
      },
      data: {
        is_enable: schedule.is_enable,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const deleteScheduleByDevice = async (device_id, action_time, action_day) => {
  const result = await prisma.schedule
    .delete({
      where: {
        action_time_device_id_action_day: {
          action_time: new Date(action_time),
          device_id: device_id,
          action_day: action_day,
        },
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const getSchedule = async (schedule) => {
  return await prisma.schedule
    .findUnique({
      where: {
        action_time_device_id_action_day: {
          action_time: new Date(schedule.action_time),
          device_id: schedule.device_id,
          action_day: schedule.action_day,
        },
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

const getAllSchedule = async () => {
  const schedules = await prisma.schedule.findMany({
    where: {
      is_enable: true,
    },
  });
  return schedules;
};
module.exports = {
  createSchedule,
  getScheduleByDevice,
  updateDeviceSchedule,
  deleteScheduleByDevice,
  getSchedule,
  getAllSchedule,
  activateSchedule,
};

const prisma = require("../init.prisma");

const createLogEvent = async (device_id) => {
  const result = await prisma.log_event
    .create({
      data: {
        action: "on",
        time_in: new Date(),
        device_id: device_id,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const findExistingOpenLog = async (device_id) => {
  const result = await prisma.log_event
    .findFirst({
      where: {
        device_id: parseInt(device_id),
        action: "on",
        time_out: null,
      },
    })
    .catch((error) => console.error(error));
  return result;
};

const findLatestOnLog = async (device_id) => {
  const lastOnLog = await prisma.log_event
    .findFirst({
      where: {
        device_id: device_id,
        action: "on",
        time_out: null,
      },
      orderBy: { time_in: "desc" },
    })
    .catch((error) => console.error(error));

  return lastOnLog;
};

const updateLogEvent = async (log_id, time_out) => {
  const result = await prisma.log_event
    .update({
      where: {
        id: log_id,
      },
      data: {
        time_out: time_out,
      },
    })
    .catch((error) => console.error(error));
  return result;
};

module.exports = {
  updateLogEvent,
  findLatestOnLog,
  findExistingOpenLog,
  createLogEvent,
};

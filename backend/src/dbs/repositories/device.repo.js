const prisma = require("../init.prisma");

const getDevicesBySerialNumber = async (serial_number) => {
  const result = await prisma.device
    .findMany({
      where: {
        serial_number: serial_number,
      },
      select: {
        id: true,
        status: true,
        type: true,
        room_name: true,
        feed: true,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const getDeviceById = async (device_id) => {
  const result = await prisma.device
    .findUnique({
      where: {
        id: device_id,
      },
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return result;
};

const updateDeviceStatus = async (id, status) => {
  const result = await prisma.device
    .update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return result;
};

const getDeviceByHomeNameAndFeed = async (homeName, feed) => {
  const home = await prisma.home
    .findMany({
      where: {
        home_name: homeName,
      },
    })
    .catch((err) => console.error(err));
  const device = await prisma.device
    .findMany({
      where: {
        feed: feed,
        serial_number: home[0].serial_number,
      },
    })
    .catch((err) => console.error(err));

  return device;
};

module.exports = {
  getDeviceById,
  getDevicesBySerialNumber,
  updateDeviceStatus,
  getDeviceByHomeNameAndFeed,
};

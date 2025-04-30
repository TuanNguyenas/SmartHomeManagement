"use strict";
const prisma = require("../init.prisma");

const getHomeByUserId = async (userId) => {
  const result = await prisma.user_have_home
    .findMany({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        home: {
          select: {
            serial_number: true,
            home_name: true,
            manager_id: true,
            aio_key: true,
          },
        },
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const getHomeByHomeId = async (homeId) => {
  const result = await prisma.home
    .findUnique({
      where: {
        id: parseInt(homeId),
      },
    })
    .catch((err) => {
      console.error(err);
    });

  return result;
};

const addUserToHomeById = async (userId, homdeId) => {
  const result = await prisma.user_have_home
    .create({
      data: {
        home_id: parseInt(homdeId),
        user_id: parseInt(userId),
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const removeUserFromHomeById = async (userId, homeId) => {
  const result = await prisma.user_have_home
    .delete({
      where: {
        user_id_home_id: {
          user_id: parseInt(userId),
          home_id: parseInt(homeId),
        },
      },
    })
    .catch((error) => console.error(error));

  return result;
};

const updateManagerByHomeId = async (userId, home_id) => {
  const result = await prisma.home
    .update({
      where: {
        id: parseInt(home_id),
      },
      data: {
        manager_id: parseInt(userId),
      },
    })
    .catch((err) => {
      console.error(err);
    });

  return result;
};

const getHomeBySerialNumber = async (serialNumber) => {
  const result = prisma.home
    .findUnique({
      where: {
        serial_number: serialNumber,
      },
    })
    .catch((err) => {
      console.error(err);
      throw new err();
    });

  return result;
};

module.exports = {
  getHomeByUserId,
  addUserToHomeById,
  updateManagerByHomeId,
  getHomeByHomeId,
  getHomeBySerialNumber,
  removeUserFromHomeById,
};

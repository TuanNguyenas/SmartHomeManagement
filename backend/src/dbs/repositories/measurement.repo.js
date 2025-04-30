const prisma = require("../init.prisma");

const upsertMeasurement = async (usage_time, consumption, device_id, month) => {
  const result = await prisma.measurement
    .upsert({
      where: {
        device_id_month: {
          device_id: device_id,
          month: month,
        },
      },
      create: {
        usage_time: usage_time,
        consumption: consumption,
        device_id: device_id,
        month: month,
      },
      update: {
        consumption: {
          increment: consumption,
        },
        usage_time: {
          increment: usage_time,
        },
      },
    })
    .catch((error) => console.error(error));
  return result;
};

const getMeasurementByDeviceId = async (device_id, month) => {
  const result = await prisma.measurement
    .findFirst({
      where: {
        device_id: parseInt(device_id),
        month: month,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return result;
};

const getMeasurementByHomeId = async (home_id) => {
  const home = await prisma.home
    .findUnique({
      where: {
        id: parseInt(home_id),
      },
    })
    .catch((error) => console.error(error));

  const deviceList = await prisma.device.findMany({
    where: {
      serial_number: home.serial_number,
    },
  });

  const deviceIds = deviceList.map((device) => device.id);

  const monthlyConsumption = await prisma.measurement.groupBy({
    by: ["month"],
    where: {
      device_id: {
        in: deviceIds,
      },
    },
    _sum: {
      consumption: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  return monthlyConsumption.map((entry) => ({
    month: entry.month.toISOString().slice(0, 7),
    total_consumption: entry._sum.consumption || 0,
  }));
};

module.exports = {
  upsertMeasurement,
  getMeasurementByDeviceId,
  getMeasurementByHomeId,
};

const prisma = require("../init.prisma");

const createNotification = async ({ device_id, content }) => {
  const result = await prisma.notification
    .create({
      data: {
        content: content,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  const date = new Date();
  const dhn = await prisma.device_have_notification
    .create({
      data: {
        device_id: parseInt(device_id),
        notification_id: result.id,
        notification_time: date.toISOString(),
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const getAllNotificationsByDeviceId = async (
  page = 1,
  limit = 10,
  device_id
) => {
  const notifications = await prisma.device_have_notification
    .findMany({
      take: limit,
      where: {
        device_id: parseInt(device_id),
      },
      include: {
        notification: true,
      },
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
      throw error;
    });

  const result = notifications.map((notification) => {
    return {
      id: notification.notification.id,
      content: notification.notification.content,
      is_read: notification.notification.is_read,
      device_id: notification.device_id,
      notification_time: notification.notification_time,
    };
  });

  return result;
};

module.exports = {
  createNotification,
  getAllNotificationsByDeviceId,
};

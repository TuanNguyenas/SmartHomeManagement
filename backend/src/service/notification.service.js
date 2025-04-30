"use strict";

const {
  getAllNotificationsByDeviceId,
} = require("../dbs/repositories/notification.repo");

const { NotFoundError } = require("../core/error.response");

const { getRedisClient } = require("../dbs/init.redis");

class NotificationService {
  static getAllNotificationsByDeviceId = async ({
    page = 1,
    limit = 10,
    device_id,
  }) => {
    const notifications = await getAllNotificationsByDeviceId(
      page,
      limit,
      device_id
    );
    if (!notifications) {
      throw new NotFoundError("No notifications found");
    }

    return {
      message: "Get notifications successfully",
      metadata: notifications,
    };
  };

  static saveFCMToken = async ({ token, userId }) => {
    const redisClient = await getRedisClient();
    await redisClient.setEx(`user:${userId}:fcm_token`, 3600, token);
    return {
      status: 200,
      message: "save token successfully",
    };
  };
}

module.exports = NotificationService;

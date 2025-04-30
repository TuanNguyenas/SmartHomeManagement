"use strict";
const NotificationService = require("../service/notification.service");

class NotificationController {
  getAllNotificationsByDeviceId = async (req, res) => {
    const device_id = req.params.deviceId;
    const response = await NotificationService.getAllNotificationsByDeviceId({
      device_id: device_id,
    });
    return res.status(200).json(response);
  };

  saveFCMToken = async (req, res) => {
    const userId = req.params.userId;
    const response = await NotificationService.saveFCMToken({
      ...req.body,
      userId,
    });
    return res.status(200).json(response);
  };
}

module.exports = new NotificationController();

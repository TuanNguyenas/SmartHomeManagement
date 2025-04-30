"use strict";

const router = require("express").Router();
const notificationController = require("../../controller/notification.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * '/v1/api/notification/{deviceId}':
 *  get:
 *     tags:
 *     - Notification controller
 *     summary: Get Notification By Device Id
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         description: The ID of the device
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Notification retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: The Device ID
 *                  content:
 *                    type: string
 *                    description: content of notification
 *                  is_read:
 *                    type: boolean
 *                    description: Notification is read or not
 *      400:
 *        description: Bad Request (Invalid userId format)
 *      404:
 *        description: No homes found for the given user ID
 *      500:
 *        description: Server error
 */
router.get(
  "/:deviceId",
  asyncHandler(notificationController.getAllNotificationsByDeviceId)
);

/**
 * @swagger
 * '/v1/api/notification/token/{userId}':
 *  post:
 *     tags:
 *     - Notification controller
 *     summary: Add notification
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of user
 *         schema:
 *           type: integer
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *            properties:
 *              content:
 *                type: string
 *     responses:
 *      200:
 *        description: save successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  description: message response
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server error
 */
router.post(
  "/token/:userId",
  asyncHandler(notificationController.saveFCMToken)
);

module.exports = router;

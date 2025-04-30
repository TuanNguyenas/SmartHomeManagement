"use strict";

const router = require("express").Router();
const deviceController = require("../../controller/device.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * '/v1/api/device/{serialNumber}':
 *  get:
 *     tags:
 *     - Device controller
 *     summary: Get Devices By Serial Number
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         description: The serial number of the house
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Devices retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: The device ID
 *                  status:
 *                    type: string
 *                    description: The status of device
 *                  type:
 *                    type: string
 *                    description: The type of device
 *                  power_rating:
 *                    type: string
 *                    description: The power rating of device
 *                  room_name:
 *                    type: string
 *                    description: The location of device
 *                  password:
 *                    type: string
 *                    description: The password of main door
 *                  serial_number:
 *                    type: string
 *                    description: The serial number of house contain device
 *                  feed:
 *                    type: string
 *                    description: name of feed to connect adafruit
 *      400:
 *        description: Bad Request (Invalid serial number format)
 *      404:
 *        description: No devices found for the given serial number
 *      500:
 *        description: Server error
 */
router.get("/:serialNumber", asyncHandler(deviceController.getAllDevices));

/**
 * @swagger
 * '/v1/api/device/user/{userId}':
 *  get:
 *     tags:
 *     - Device controller
 *     summary: Get devices by user ID
 *     produces:
 *     - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       404:
 *         description: No devices found for the given user ID
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", asyncHandler(deviceController.getDevicesByUserId));

/**
 * @swagger
 * '/v1/api/device/update/status':
 *  post:
 *     tags:
 *     - Device controller
 *     summary: Update device status
 *     produces:
 *     - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: integer
 *                 description: The ID of the device
 *               status:
 *                 type: string
 *                 description: The new status of the device
 *     responses:
 *       200:
 *         description: Device status updated successfully
 *       400:
 *         description: Invalid request payload
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.post(
  "/update/status",
  asyncHandler(deviceController.updateDeviceStatus)
);

/**
 * @swagger
 * '/v1/api/device/measurement/{deviceId}':
 *  post:
 *     tags:
 *     - Device controller
 *     summary: Get device measurement
 *     produces:
 *     - application/json
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         description: The ID of the device
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 description: month
 *               year:
 *                 type: string
 *                 description: year
 *     responses:
 *       200:
 *         description: Get Measurement Successfully
 *       400:
 *         description: Invalid request payload
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.post(
  "/measurement/:deviceId",
  asyncHandler(deviceController.getDeviceMeasurement)
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The device ID
 *         status:
 *           type: string
 *           description: The status of the device
 *         type:
 *           type: string
 *           description: The type of the device
 *         power_rating:
 *           type: string
 *           description: The power rating of the device
 *         room_name:
 *           type: string
 *           description: The location of the device
 *         password:
 *           type: string
 *           description: The password of the main door
 *         serial_number:
 *           type: string
 *           description: The serial number of the house containing the device
 *         feed:
 *           type: string
 *           description: Name of feed to connect Adafruit
 */
module.exports = router;

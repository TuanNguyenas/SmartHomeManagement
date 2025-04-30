"use strict";

const router = require("express").Router();
const homeController = require("../../controller/home.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * '/v1/api/home/{userId}':
 *  get:
 *     tags:
 *     - Home controller
 *     summary: Get Homes By User Id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve homes for
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Homes retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  user_id:
 *                    type: integer
 *                    description: The user ID
 *                  home_id:
 *                    type: integer
 *                    description: The home ID
 *                  home:
 *                    type: object
 *                    properties:
 *                      serial_number:
 *                        type: string
 *                        description: The serial number of the home
 *                      home_name:
 *                        type: string
 *                        description: The name of the home
 *      400:
 *        description: Bad Request (Invalid userId format)
 *      404:
 *        description: No homes found for the given user ID
 *      500:
 *        description: Server error
 */
router.get("/:userId", asyncHandler(homeController.getHomeByUserId));

/**
 * @swagger
 * '/v1/api/home/serial/{serialNumber}':
 *  get:
 *     tags:
 *     - Home controller
 *     summary: Get home by serial number
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         description: The serial number of the home
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Home retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  description: The status code of the response
 *                message:
 *                  type: string
 *                  description: The message associated with the response
 *                home:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: The home ID
 *                    home_name:
 *                      type: string
 *                      description: The name of the home
 *                    serial_number:
 *                      type: string
 *                      description: The serial number of the home
 *                    manager_id:
 *                      type: integer
 *                      description: The ID of the manager
 *                    aio_key:
 *                      type: string
 *                      description: The AIO key for the home
 *                    devices:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: integer
 *                            description: The device ID
 *                          status:
 *                            type: string
 *                            description: The current status of the device
 *                          type:
 *                            type: string
 *                            description: The type of the device (e.g., light_sensor, fan)
 *                          room_name:
 *                            type: string
 *                            description: The room where the device is located
 *                          feed:
 *                            type: string
 *                            description: The feed associated with the device
 *      400:
 *        description: Bad Request (Invalid serial number format)
 *      404:
 *        description: No home found for the given serial number
 *      500:
 *        description: Server error
 */
router.get(
  "/serial/:serialNumber",
  asyncHandler(homeController.getHomeBySerialNumber)
);

/**
 * @swagger
 * '/v1/api/home/add':
 *  post:
 *     tags:
 *     - Home controller
 *     summary: Add user to home
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - userEmail
 *              - homeId
 *            properties:
 *              userEmail:
 *                type: string
 *                format: email
 *              homeId:
 *                type: number
 *     responses:
 *      200:
 *        description: Add successfully
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
 *        description: Bad Request (Invalid userEmail or homeId)
 *      404:
 *        description: Not Found
 *      409:
 *        description: Conflict (User is already in home)
 *      500:
 *        description: Server error
 */
router.post("/add", asyncHandler(homeController.addUserToHomeById));

/**
 * @swagger
 * '/v1/api/home/delete':
 *  delete:
 *     tags:
 *     - Home controller
 *     summary: Remove user from home
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - userId
 *              - homeId
 *            properties:
 *              userId:
 *                type: integer
 *              homeId:
 *                type: integer
 *     responses:
 *      200:
 *        description: Remove Successfully successfully
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
 *        description: Bad Request (Invalid userId or homeId)
 *      404:
 *        description: Not Found
 *      409:
 *        description: Conflict (User is already in home)
 *      500:
 *        description: Server error
 */
router.delete("/delete", asyncHandler(homeController.removeUserFromHomeById));

/**
 * @swagger
 * '/v1/api/home/measurement/{homeId}':
 *  get:
 *     tags:
 *     - Home controller
 *     summary: Get Measurement by Home Id
 *     parameters:
 *       - in: path
 *         name: homeId
 *         required: true
 *         description: The ID of home
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Homes retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  user_id:
 *                    type: integer
 *                    description: The user ID
 *                  home_id:
 *                    type: integer
 *                    description: The home ID
 *                  home:
 *                    type: object
 *                    properties:
 *                      serial_number:
 *                        type: string
 *                        description: The serial number of the home
 *                      home_name:
 *                        type: string
 *                        description: The name of the home
 *      400:
 *        description: Bad Request (Invalid userId format)
 *      404:
 *        description: No homes found for the given user ID
 *      500:
 *        description: Server error
 */
router.get(
  "/measurement/:homeId",
  asyncHandler(homeController.getMeasurementByHomeId)
);

module.exports = router;

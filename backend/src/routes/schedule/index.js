"use strict";

const router = require("express").Router();
const scheduleController = require("../../controller/schedule.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: API for managing device schedules
 */

/**
 * @swagger
 * '/v1/api/schedule/device/{device_id}':
 *  get:
 *     tags:
 *     - Schedule
 *     summary: Get schedules by device ID
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Device schedules retrieved successfully
 *       404:
 *         description: No schedules found for this device
 *       500:
 *         description: Server error
 */
router.get(
  "/device/:device_id",
  asyncHandler(scheduleController.getScheduleByDevice)
);

/**
 * @swagger
 * '/v1/api/schedule/{device_id}':
 *  post:
 *     tags:
 *     - Schedule
 *     summary: Create a new schedule
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action_time:
 *                 type: string
 *                 format: date-time
 *                 description: Time of action. (2025-04-02T19:00:00+7:00)
 *               action_day:
 *                 type: string
 *                 format: string
 *                 description: Day of week
 *                 enum: [everyday, monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               action:
 *                 type: string
 *                 enum: [on, off]
 *                 description: Action to be performed
 *               value:
 *                 type: integer
 *                 description: Value associated with the action (if applicable)
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Schedule conflict at this time
 *       500:
 *         description: Server error
 */
router.post("/:device_id", asyncHandler(scheduleController.createSchedule));

/**
 * @swagger
 * '/v1/api/schedule/{device_id}':
 *  put:
 *     tags:
 *     - Schedule
 *     summary: Update a device's schedule
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action_day_old:
 *                 type: string
 *                 description: Original Day of week
 *                 enum: [everyday, monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               action_day:
 *                 type: string
 *                 description: New Day of week
 *                 enum: [everyday, monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               action_time_old:
 *                 type: string
 *                 format: date-time
 *                 description: Original schedule time (2025-04-02T19:00:00+7:00)
 *               action_time:
 *                 type: string
 *                 format: date-time
 *                 description: New schedule time (2025-04-02T19:00:00+7:00)
 *               action:
 *                 type: string
 *                 enum: [on, off]
 *                 description: Action to be performed
 *               is_enable:
 *                 type: boolean
 *                 description: Enable schedule or not
 *               value:
 *                 type: integer
 *                 description: Updated action value
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:device_id",
  asyncHandler(scheduleController.updateDeviceSchedule)
);

/**
 * @swagger
 * '/v1/api/schedule/activate/{device_id}':
 *  put:
 *     tags:
 *     - Schedule
 *     summary: Update a device's schedule
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action_day:
 *                 type: string
 *                 description: New Day of week
 *                 enum: [everyday, monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               action_time:
 *                 type: string
 *                 format: date-time
 *                 description: New schedule time (2025-04-02T19:00:00+7:00)
 *               is_enable:
 *                 type: boolean
 *                 description: Enable schedule or not
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.put(
  "/activate/:device_id",
  asyncHandler(scheduleController.activateSchedule)
);

/**
 * @swagger
 * '/v1/api/schedule/{device_id}':
 *  delete:
 *     tags:
 *     - Schedule
 *     summary: Delete a device's schedule
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action_time:
 *                 type: string
 *                 format: date-time
 *                 description: Schedule time to delete
 *               action_day:
 *                 type: string
 *                 description: day of week to delete
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:device_id",
  asyncHandler(scheduleController.deleteScheduleByDevice)
);

module.exports = router;

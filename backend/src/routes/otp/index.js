const router = require("express").Router();
const OtpController = require("../../controller/otp.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * '/v1/api/otp/send-otp':
 *  post:
 *     tags:
 *     - Otp controller
 *     summary: Send OTP to User
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *     responses:
 *      200:
 *        description: Send OTP Successfully
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
 *      500:
 *        description: Server error
 */
router.post("/send-otp", asyncHandler(OtpController.sendOTP));

/**
 * @swagger
 * '/v1/api/otp/verify-otp':
 *  post:
 *     tags:
 *     - Otp controller
 *     summary: Verify OTP
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              otp:
 *                type: string
 *     responses:
 *      200:
 *        description: Verify OTP Successfully
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
 *      500:
 *        description: Server error
 */
router.post("/verify-otp", asyncHandler(OtpController.verifyOTP));

module.exports = router;

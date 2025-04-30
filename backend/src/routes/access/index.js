const router = require("express").Router();
const accessController = require("../../controller/access.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../authUtils/auth");

/**
 * @swagger
 * '/v1/api/user/signup':
 *  post:
 *     tags:
 *     - Access controller
 *     summary: Signup for user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - first_name
 *              - last_name
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *     responses:
 *      201:
 *        description: Signup successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 201
 *                message:
 *                  type: string
 *                  description: message response
 *                salt:
 *                  type: string
 *                  description: Salt for hash password
 *      400:
 *        description: Bad Request (Invalid email or password)
 *      404:
 *        description: Not Found
 *      409:
 *        description: Conflict (User is already logged in)
 *      500:
 *        description: Server error
 */
router.post("/user/signup", asyncHandler(accessController.signup));

/**
 * @swagger
 * '/v1/api/user/login':
 *  post:
 *     tags:
 *     - Access controller
 *     summary: Login for user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *     responses:
 *      200:
 *        description: Login successfully
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
 *                first_name:
 *                  type: string
 *                  description: first name of user
 *                last_name:
 *                  type: string
 *                  description: last name of user
 *                access_token:
 *                  type: string
 *                  description: A token used for accessing protected routes
 *                userId:
 *                  type: string
 *                  description: The ID of user
 *                salt:
 *                  type: string
 *                  description: Salt for hash password
 *      400:
 *        description: Bad Request (Invalid email or password)
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server error
 */
router.post("/user/login", asyncHandler(accessController.login));

/**
 * @swagger
 * '/v1/api/user/reset-password':
 *  post:
 *     tags:
 *     - Access controller
 *     summary: Reset password for user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *     responses:
 *      200:
 *        description: Reset password successfully
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
 *                salt:
 *                  type: string
 *                  description: New salt for hash password
 *      400:
 *        description: Bad Request (Invalid email or password)
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server error
 */
router.post(
  "/user/reset-password",
  asyncHandler(accessController.resetPassword)
);

// router.use(authentication);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 *       description: "Bearer token for authorization"
 *     ClientIdAuth:
 *       type: apiKey
 *       in: header
 *       name: client_id
 *       description: "Client ID for identifying the client application"
 * '/v1/api/user/logout':
 *  post:
 *     tags:
 *     - Access controller
 *     summary: Logout for user
 *     security:
 *       - BearerAuth: []
 *       - ClientIdAuth: []
 *     responses:
 *      200:
 *        description: Logout successfully
 *      400:
 *        description: Bad Request (Invalid or missing token)
 *      401:
 *        description: Unauthorized (Token is invalid or expired)
 *      500:
 *        description: Server error
 */
router.post("/user/logout", asyncHandler(accessController.logout));

/**
 * @swagger
 * '/v1/api/user/unlock':
 *  post:
 *     tags:
 *     - Access controller
 *     summary: Unlock door
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - device_id
 *              - password
 *            properties:
 *              device_id:
 *                type: integer
 *              password:
 *                type: string
 *                format: password
 *     responses:
 *      200:
 *        description: Unlock successfully
 *      400:
 *        description: Bad Request (Invalid or missing token)
 *      401:
 *        description: Unauthorized (Token is invalid or expired)
 *      500:
 *        description: Server error
 */
router.post("/user/unlock", asyncHandler(accessController.unlockDoor));

module.exports = router;

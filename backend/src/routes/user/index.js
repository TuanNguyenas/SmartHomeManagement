const router = require("express").Router();
const UserController = require("../../controller/user.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

/**
 * @swagger
 * '/v1/api/user/home/{homeId}':
 *  get:
 *     tags:
 *     - User controller
 *     summary: Get all User in Home
 *     parameters:
 *       - in: path
 *         name: homeId
 *         required: true
 *         description: Home ID
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Get User Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                users:
 *                  type: array
 *                  description: List of users in home
 *                  items:
 *                    type: object
 *                    properties:
 *                      user_id:
 *                        type: integer
 *                        example: 4
 *                      home_id:
 *                        type: integer
 *                        example: 1
 *      400:
 *        description: Bad Request (Invalid email or password)
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server error
 */
router.get("/home/:homeId", asyncHandler(UserController.getUserByHomeId));

/**
 * @swagger
 * '/v1/api/user/{userId}':
 *  get:
 *     tags:
 *     - User controller
 *     summary: Get user by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *        description: Get User Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                user:
 *                  type: object
 *                  description: List of users in home
 *                  properties:
 *                    user_id:
 *                      type: integer
 *                      example: 4
 *                    first_name:
 *                      type: string
 *                      example: "Vo"
 *                    last_name:
 *                      type: string
 *                      example: "Tran"
 *                    email:
 *                      type: string
 *                      example: "voquynhchantran120804@gmail.com"
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server error
 */
router.get("/:userId", asyncHandler(UserController.getUserByUserId));
module.exports = router;

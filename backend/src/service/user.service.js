"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  getUserByHomeId,
  getUserByUserId,
} = require("../dbs/repositories/user.repo");

class UserService {
  static getUserByHomeId = async ({ home_id }) => {
    const userList = await getUserByHomeId(home_id);
    if (!userList) {
      throw new BadRequestError("User not found");
    }
    return {
      status: 200,
      users: userList,
    };
  };

  static getUserByUserId = async ({ user_id }) => {
    const user = await getUserByUserId(user_id);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return {
      status: 200,
      user: user,
    };
  };
}

module.exports = UserService;

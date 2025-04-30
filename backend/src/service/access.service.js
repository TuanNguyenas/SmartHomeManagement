"use strict";

const {
  BadRequestError,
  AuthFailureError,
  ConflictRequestError,
} = require("../core/error.response");
const jwt = require("jsonwebtoken");
const {
  getUserByEmail,
  removeTokenById,
  setTokenById,
  updatePasswordById,
  insertUser,
} = require("../dbs/repositories/user.repo");

const { generateKey } = require("../authUtils/auth");
const { getDeviceById } = require("../dbs/repositories/device.repo");
const { getHomeBySerialNumber } = require("../dbs/repositories/home.repo");

class AccessService {
  static signup = async ({ email, password, first_name, last_name }) => {
    const foundUser = await getUserByEmail(email);
    if (foundUser) {
      throw new ConflictRequestError("Error: User already registered");
    }

    const hash_password = await generateKey(password);
    const newUser = {
      email,
      password_hash: hash_password.key,
      salt: hash_password.salt,
      first_name: first_name,
      last_name: last_name,
    };

    const result = await insertUser(newUser);

    if (result) {
      return {
        status: 201,
        message: "Signup successfully",
        salt: hash_password.salt,
      };
    } else {
      throw new ConflictRequestError("Error: Can't create account");
    }
  };

  static login = async ({ email, password }) => {
    const foundUser = await getUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    const hash_password = await generateKey(password, foundUser.salt);
    const matchPassword = hash_password.key === foundUser.password_hash;

    if (!matchPassword) {
      throw new AuthFailureError("Invalid password");
    }

    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      process.env.SECRET_KEY || "HCMUT"
    );

    const setToken = await setTokenById(token, foundUser.id);

    if (!setToken) {
      throw new BadRequestError("Failed to save access token");
    }

    return {
      status: 200,
      message: "Login successfully",
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      access_token: token,
      userId: foundUser.id,
      salt: foundUser.salt,
    };
  };

  static logout = async ({ access_token, id }) => {
    if (!access_token) {
      throw new BadRequestError("Bad Requests");
    }

    const deleteToken = await removeTokenById(id);
    if (!deleteToken) {
      throw new BadRequestError("Failed to logout");
    }

    return {
      status: 200,
      message: "Logout Successfully",
    };
  };

  static resetPassword = async ({ email, password }) => {
    const foundUser = await getUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    const { key, salt } = await generateKey(password);
    const updatePassword = await updatePasswordById(key, salt, foundUser.id);
    if (!updatePassword) {
      throw new BadRequestError("Failed to update password");
    }

    return {
      status: 200,
      message: "Reset password successfully",
      salt: salt,
    };
  };

  static unlockDoor = async ({ device_id, password }) => {
    const door = await getDeviceById(device_id);
    if (door.type !== "door") {
      throw new BadRequestError("Not a door");
    }
    if (door.password === password) {
      const home = await getHomeBySerialNumber(door.serial_number);
      const response = await fetch(
        `https://io.adafruit.com/api/v2/${home.home_name}/feeds/${door.feed}/data?x-aio-key=${home.aio_key}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: password,
          }),
        }
      );
      if (!response.ok) {
        throw new BadRequestError("Can't open the door");
      }
      return {
        status: 200,
        message: "Unlock successfully",
      };
    } else {
      throw new AuthFailureError("Incorrect password");
    }
  };
}

module.exports = AccessService;

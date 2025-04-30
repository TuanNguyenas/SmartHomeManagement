"use strict";

const otpGenerator = require("otp-generator");
const { getRedisClient } = require("../dbs/init.redis");
const { sendVerificationEmail } = require("../utils/MailSender");
const { getUserByEmail } = require("../dbs/repositories/user.repo");
const { BadRequestError } = require("../core/error.response");

class OtpService {
  static async sendOTP({ email }) {
    try {
      // Generate OTP
      const foundUser = await getUserByEmail(email);
      if (!foundUser) {
        throw new BadRequestError("User not found");
      }

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      await sendVerificationEmail(email, otp);

      const redisClient = await getRedisClient();
      await redisClient.setEx(email, 900, otp);

      return {
        status: 200,
        message: "OTP sent successfully to the provided email address.",
      };
    } catch (error) {
      console.error("Error sending OTP: ", error);
      return {
        status: 500,
        message: "Failed to send OTP. Please try again later.",
      };
    }
  }

  static async verifyOTP({ email, otp }) {
    try {
      const redisClient = await getRedisClient();
      let foundOTP = await redisClient.get(email);

      if (!foundOTP) {
        return {
          status: 400,
          message: "OTP has expired or was not found. Please request a new OTP",
        };
      }

      if (foundOTP === otp) {
        return {
          status: 200,
          message: "OTP verified successfully",
        };
      } else {
        return {
          status: 400,
          message: "Invalid OTP. Please try again",
        };
      }
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      return {
        status: 500,
        message:
          "An error occured while verifying OTP. Please try again later.",
      };
    }
  }
}

module.exports = OtpService;

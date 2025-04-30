"use strict";

const OtpService = require("../service/otp.service");

class OtpController {
  sendOTP = async (req, res) => {
    const response = await OtpService.sendOTP(req.body);
    return res.status(200).json(response);
  };

  verifyOTP = async (req, res) => {
    const response = await OtpService.verifyOTP(req.body);
    return res.status(200).json(response);
  };
}

module.exports = new OtpController();

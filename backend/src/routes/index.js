"use strict";

const router = require("express").Router();

router.use("/v1/api/user", require("./user"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/schedule", require("./schedule"));
router.use("/v1/api/device", require("./device"));
router.use("/v1/api/home", require("./home"));
router.use("/v1/api/otp", require("./otp"));
router.use("/v1/api", require("./access"));
router.use("", require("./demo"));

module.exports = router;

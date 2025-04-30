const router = require("express").Router();
const { asyncHandler } = require("../../helper/asyncHandler");

router.get(
  "/",
  asyncHandler((req, res) => {
    return res.status(200).json({ message: "OK" });
  })
);

module.exports = router;

"use strict";

const { BadRequestError } = require("../core/error.response");

const {
  getMeasurementByDeviceId,
} = require("../dbs/repositories/measurement.repo");

class MeasurementService {
  static getMeasurementByDevice = async ({ device_id, month, year }) => {
    const newMonth = new Date(year, month);
    const measure = await getMeasurementByDeviceId(device_id, newMonth);
    if (!measure) {
      throw new BadRequestError("Error get measurement");
    }

    return {
      status: 200,
      measure: measure,
    };
  };
}

module.exports = MeasurementService;

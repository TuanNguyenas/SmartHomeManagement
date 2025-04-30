"use strict";
const HomeService = require("../service/home.service");

class HomeController {
  getHomeByUserId = async (req, res) => {
    const response = await HomeService.getHomeByUserId(req.params);
    return res.status(201).json(response);
  };

  addUserToHomeById = async (req, res) => {
    const response = await HomeService.addUserToHomeById(req.body);
    return res.status(200).json(response);
  };

  removeUserFromHomeById = async (req, res) => {
    const response = await HomeService.removeUserFromHomeById(req.body);
    return res.status(200).json(response);
  };

  getHomeBySerialNumber = async (req, res) => {
    const response = await HomeService.getHomeBySerialNumber(req.params);
    return res.status(200).json(response);
  };

  getMeasurementByHomeId = async (req, res) => {
    const home_id = req.params.homeId;
    const response = await HomeService.getMeasurementByHomeId({
      home_id: home_id,
    });

    return res.status(200).json(response);
  };
}

module.exports = new HomeController();

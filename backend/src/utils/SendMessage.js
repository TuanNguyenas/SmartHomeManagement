require("dotenv").config();
const { getRedisClient } = require("../dbs/init.redis");
const admin = require("firebase-admin");
const { updateDeviceStatus } = require("../service/device.service");
const { getUserByHomeId } = require("../dbs/repositories/user.repo");
const { createNotification } = require("../dbs/repositories/notification.repo");

const roomName = {
  bedroom: "Bed Room",
  garden: "Garden",
  kitchen: "Kitchen",
  livingroom: "Living Room",
};

const deviceName = {
  light: "Light",
  fan: "Fan",
};

const sendFCMMessage = async (token, payload) => {
  try {
    const response = await admin.messaging().send({
      token,
      ...payload,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("FCM send error:", error);
    throw error;
  }
};

const sendMessage = async (deviceResponse, homeResponse, device_id, value) => {
  const username = homeResponse.home_name;
  const feed = deviceResponse.metadata.feed;
  const aioKey = homeResponse.aio_key;
  const message = `${roomName[deviceResponse.metadata.room_name]} ${
    deviceName[deviceResponse.metadata.type]
  } Has ${value === 1 ? "Turn On" : "Turn Off"}`;
  const userList = await getUserByHomeId(homeResponse.id);
  const responseAda = await fetch(
    `https://io.adafruit.com/api/v2/${username}/feeds/${feed}/data?x-aio-key=${aioKey}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: value,
      }),
    }
  );

  if (!responseAda.ok) {
    throw new BadRequestError("Error update status to Adafruit");
  }

  await updateDeviceStatus({
    device_id,
    status: `${value === 1 ? "on" : "off"}`,
  });

  await createNotification({ content: message, device_id: device_id });

  for (const user of userList) {
    const redisClient = await getRedisClient();
    const foundToken = await redisClient.get(`user:${user.user_id}:fcm_token`);
    if (!foundToken) {
      continue;
    }

    const payload = {
      notification: {
        title: "Thông báo mới",
        body: message,
      },
    };

    await sendFCMMessage(foundToken, payload);
  }

  return await response.json();
};

module.exports = { sendMessage };

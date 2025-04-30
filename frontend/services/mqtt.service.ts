import mqtt, { MqttClient } from "mqtt";
import Device from "@/interface/device.interface";
import { store } from "../redux/store";
import { changeDeviceStatus } from "@/redux/slices/userSlice";

class MqttService {
  private client: MqttClient | null = null;

  connect(
    home_name: string,
    aiokey: string,
    devices: Device[],
    OnMessageCallback: (topic: string, message: string) => void
  ): MqttClient {
    if (this.client) {
      return this.client;
    }

    this.client = mqtt.connect("mqtts://io.adafruit.com", {
      username: home_name,
      password: aiokey,
    });

    this.client.on("connect", () => {
      console.log("Connected to Adafruit IO");
      devices.forEach((device) => {
        this.client?.subscribe(`${home_name}/feeds/${device.feed}`, (err) => {
          if (err) {
            console.log(`Can't subcribe to feed ${device.id}`);
          } else {
            console.log(`Subscribe to feed ${device.id} successfully`);
          }
        });
      });
    });

    this.client.on("error", (err) => {
      console.error(`MQTT Client encountered an error: ${err.message}`);
    });

    this.client.on("message", (topic, message) => {
      OnMessageCallback(topic, message.toString());
      const value = parseInt(message.toString());
      const home_name = topic.split("/")[0];
      const feed = topic.split("/")[2];
      const state = store.getState();
      const homeList = state.user.homes.filter(
        (home) => home.home_name === home_name
      );
      if (homeList.length === 0) {
        console.error("Home not found");
      }
      const device = homeList[0].devices.filter(
        (device) => device.feed === feed
      )[0];
      store.dispatch(
        changeDeviceStatus({
          homeId: homeList[0].home_id,
          deviceId: device.id,
          status: `${value === 1 ? "on" : "off"}`,
        })
      );
    });

    return this.client;
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      console.log("Disconnected MQTT");
    }
  }
}

export const mqttService = new MqttService();

import Header from "@/components/Header";
import QuickAccessCard from "@/components/QuickAccessCard";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Device from "@/interface/device.interface";

type DeviceListParams = {
  devices?: string;
  roomName: string;
};

const isDeviceType = (
  type: string
): type is "light" | "fan" | "airConditioner" => {
  return ["light", "fan", "airConditioner"].includes(type);
};

const DeviceList = () => {
  const { devices, roomName } = useLocalSearchParams<DeviceListParams>();
  const parsedDevices: Device[] = devices ? JSON.parse(devices as string) : [];

  const getDevicePathname = (deviceType: string) => {
    switch (deviceType) {
      case "fan":
        return "/(deviceconfig)/Fan";
      case "light":
        return "/(deviceconfig)/Light";
      case "airConditioner":
        return "/(deviceconfig)/AirConditioner";
      default:
        console.warn(`Invalid device type: ${deviceType}`);
        return null;
    }
  };

  if (parsedDevices.length === 0) {
    return (
      <View style={styles.container}>
        <Header>{`${
          roomName.charAt(0).toUpperCase() + roomName.slice(1)
        }'s Devices`}</Header>
        <Text style={styles.emptyText}>No devices found in this room</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header>{`${
        roomName.charAt(0).toUpperCase() + roomName.slice(1)
      }'s Devices`}</Header>
      <View style={styles.cardContainer}>
        {parsedDevices.map((device) => {
          if (!isDeviceType(device.type)) {
            console.warn(`Invalid device type: ${device.type}`);
            return null;
          }
          const pathname = getDevicePathname(device.type);
          if (!pathname) return null;

          return (
            <QuickAccessCard
              key={device.id}
              id={device.id}
              havingSwitch={["light", "fan"].includes(device.type)}
              deviceType={device.type}
              roomName={roomName}
              onPress={() =>
                router.push({
                  pathname: pathname,
                  params: { id: device.id, deviceType: device.type },
                })
              }
            />
          );
        })}
      </View>
    </View>
  );
};

export default DeviceList;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  cardContainer: {
    flex: 1,
    width: "90%",
    gap: 20,
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

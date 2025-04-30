import QuickAccessCard from "@/components/QuickAccessCard";
import WelcomeCard from "@/components/WelcomeCard";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { deviceTypes } from "@/constants/deviceType";
import roomTypes from "@/constants/roomType";
import { router } from "expo-router";

type DeviceItem = {
  id: number;
  deviceType: keyof typeof deviceTypes;
  roomName: string;
};

const devices: DeviceItem[] = [
  {
    id: 1,
    deviceType: "airConditioner",
    roomName: roomTypes.livingRoom,
  },
  {
    id: 2,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 3,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 4,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 5,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 6,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 7,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 8,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
  {
    id: 9,
    deviceType: "fan",
    roomName: roomTypes.bedroom,
  },
];

const AutomationScreen = () => {
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
  return (
    <View style={styles.container}>
      <WelcomeCard onScreen="automation" />
      <FlatList
        style={styles.flatList}
        data={devices}
        renderItem={({ item }) => {
          const pathname = getDevicePathname(item.deviceType);
          if (!pathname) return null;
          return (
            <QuickAccessCard
              deviceType={item.deviceType}
              roomName={item.roomName}
              havingSwitch={["light", "fan"].includes(item.deviceType)}
              onPress={() =>
                router.push({
                  pathname: pathname,
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "center", gap: 10 }}
        contentContainerStyle={{
          justifyContent: "center",
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AutomationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scheduleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    paddingHorizontal: 26,
    position: "absolute",
    flexWrap: "wrap",
    top: "20%",
  },
  flatList: {
    flex: 1,
    gap: 10,
    width: "100%",
    position: "absolute",
    top: "23%",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

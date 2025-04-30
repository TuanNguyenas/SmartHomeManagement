import Header from "@/components/Header";
import RoomCard from "@/components/RoomCard";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Device from "@/interface/device.interface";

type RoomListParams = {
  devices?: string;
};

const RoomList = () => {
  const { devices } = useLocalSearchParams<RoomListParams>();
  const parsedDevices: Device[] = devices ? JSON.parse(devices as string) : [];

  const groupDevicesByRoom = () => {
    return parsedDevices.reduce((acc: Record<string, Device[]>, device) => {
      const room = device.room_name;

      if (room.toLowerCase() === "all" || room.toLowerCase() === "garden")
        return acc;

      if (!acc[room]) {
        acc[room] = [];
      }
      acc[room].push(device);
      return acc;
    }, {});
  };

  const roomGroups = groupDevicesByRoom();

  const handleRoomPress = (devices: Device[]) => {
    router.push({
      pathname: "/DeviceList",
      params: {
        devices: JSON.stringify(devices),
        roomName: devices[0]?.room_name || "Unknown Room",
      },
    });
  };

  if (parsedDevices.length === 0) {
    return (
      <View style={styles.container}>
        <Header>Room List</Header>
        <Text style={styles.emptyText}>No devices found in any rooms</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header>Room List</Header>
      <View style={styles.roomContainer}>
        {Object.entries(roomGroups).map(([roomName, devices]) => (
          <RoomCard
            key={roomName}
            roomName={roomName}
            deviceCount={devices.length}
            onPress={() => handleRoomPress(devices)}
          />
        ))}
      </View>
    </View>
  );
};

export default RoomList;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  roomContainer: {
    flex: 1,
    width: "90%",
    gap: 20,
    marginTop: 16,
    elevation: 10,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

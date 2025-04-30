import React, { useState } from "react";

import {
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { deviceTypes, DeviceType } from "@/constants/deviceType";
import { useDispatch, useSelector } from "react-redux";
import { changeDeviceStatus } from "@/redux/slices/userSlice";
import Home from "@/interface/home.interface";
import Device from "@/interface/device.interface";
import { RootState } from "@/redux/store";

type QuickAccessCardProps = {
  id: number;
  havingSwitch?: boolean;
  deviceType: DeviceType;
  roomName: string;
  onPress: () => void;
};

const DEVICE_IMAGES: Record<DeviceType, any> = {
  fan: require("@/assets/images/devices/image-fan.png"),
  light: require("@/assets/images/devices/image-light.png"),
  airConditioner: require("@/assets/images/devices/image-air-conditioner.png"),
};

const QuickAccessCard = ({
  id,
  havingSwitch = true,
  deviceType,
  roomName,
  onPress,
}: QuickAccessCardProps) => {
  const homeId = useSelector((state: any) => state.user.selectedHome);
  const deviceStatus = useSelector((state: RootState) => {
    const home = state.user.homes.find((home: Home) => home.home_id === homeId);
    if (!home) return null;

    const device = home.devices.find((device: Device) => device.id === id);
    return device ? device.status : null;
  });
  const dispatch = useDispatch();
  // const [isEnabled, setIsEnabled] = useState<boolean>(deviceStatus === "on");
  const isEnabled = deviceStatus === "on";
  const deviceName = deviceTypes[deviceType];

  const handleChange = async () => {
    const newStatus = !isEnabled ? "on" : "off";
    const response = await fetch(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/device/update/status",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: id,
          status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error change status");
    }

    dispatch(
      changeDeviceStatus({
        homeId,
        deviceId: id,
        status: newStatus,
      })
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Image
        style={styles.imgStyle}
        source={DEVICE_IMAGES[deviceType]}
        accessibilityLabel={`${deviceName} icon`}
      />
      <Text style={styles.titleText}>{deviceName}</Text>
      <Text style={styles.roomText}>{roomName}</Text>
      {havingSwitch && (
        <TouchableOpacity
          onPress={(e) => e.stopPropagation()}
          activeOpacity={1}
        >
          <Switch
            trackColor={{ false: "#D1D1D6", true: Colors.primary800 }}
            thumbColor={isEnabled ? "#FFFFFF" : "#F2F2F7"}
            ios_backgroundColor="#D1D1D6"
            onValueChange={handleChange}
            value={isEnabled}
            style={styles.switch}
          />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default QuickAccessCard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "45%",
    height: 200,
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    elevation: 10, // For Android shadow
  },
  imgStyle: {
    width: 60,
    height: 60,
  },
  titleText: {
    color: Colors.primary800,
    fontSize: 20,
  },
  roomText: {
    color: Colors.neutral500,
    fontSize: 14,
    marginBottom: 12,
  },
  switch: {
    transform: [{ scale: 1.2 }], // Makes the switch bigger
  },
});

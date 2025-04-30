import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Home from "@/interface/home.interface";
import Device from "@/interface/device.interface";
import { router, useLocalSearchParams } from "expo-router";
import { changeDeviceStatus } from "@/redux/slices/userSlice";

const Light = () => {
  const { id, deviceType } = useLocalSearchParams();
  const homeId = useSelector((state: any) => state.user.selectedHome);
  const deviceId = typeof id === "string" ? parseInt(id, 10) : null;

  if (deviceId === null || isNaN(deviceId)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EAF1F8" }}>
        <View style={styles.container}>
          <Header>Smart Light</Header>
          <Text style={styles.errorText}>Invalid device ID</Text>
        </View>
      </SafeAreaView>
    );
  }

  const deviceStatus = useSelector((state: RootState) => {
    const home = state.user.homes.find((home: Home) => home.home_id === homeId);
    if (!home) return null;

    // xu li k thuoc home
    const device = home.devices.find(
      (device: Device) => device.id === deviceId
    );
    return device ? device.status : null;
  });

  if (deviceStatus === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EAF1F8" }}>
        <View style={styles.container}>
          <Header>Smart Light</Header>
          <Text style={styles.errorText}>Device not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // const [isOn, setIsOn] = useState(deviceStatus === "on");
  const isOn = deviceStatus === "on";
  const [brightness, setBrightness] = useState(100);
  const [selectedColor, setSelectedColor] = useState("#FFD700");

  const colors = ["#0057FF", "#FFFFE0", "#FFD700"];

  const dispatch = useDispatch();

  const handleChange = async () => {
    const newStatus = !isOn ? "on" : "off";
    const response = await fetch(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/device/update/status",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: deviceId,
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
        deviceId,
        status: newStatus,
      })
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EAF1F8" }}>
      <View style={styles.container}>
        {/* Back Button */}
        <Header>Smart Light</Header>

        {/* Light Image */}

        {/* Toggle Switch */}
        <View style={styles.switchContainer}>
          <Switch value={isOn} onValueChange={handleChange} />
        </View>

        {/* Color Selection */}
        <View style={styles.sliderContainer}>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 1 : 0,
                    borderColor: "#fff",
                    transform: [{ scale: selectedColor === color ? 1.5 : 1 }],
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
            <TouchableOpacity style={[styles.colorCircle, styles.addColor]}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={brightness}
            onValueChange={(value) => setBrightness(value)}
            minimumTrackTintColor="#0057FF"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#0057FF"
          />
        </View>

        {/* Brightness Control */}
        <View style={styles.brightnessContainer}>
          <Image
            source={require("@/assets/images/devicesConfig/lamp.png")}
            resizeMode="contain"
          />

          {isOn ? (
            <Image
              style={styles.shadowImg}
              source={require("@/assets/images/devicesConfig/ligjt.png")}
              resizeMode="contain"
            />
          ) : (
            <View style={{ height: 200 }}></View>
          )}
          <Text style={styles.brightnessText}>{Math.round(brightness)}%</Text>
          <Text style={styles.brightnessLabel}>Brightness</Text>
        </View>

        {/* Schedule Button */}
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => {
            router.push({
              pathname: "/(subscreen)/ScheduleScreen",
              params: { deviceId },
            });
          }}
        >
          <Text style={styles.scheduleText}>Set Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Light;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF1F8",
    alignItems: "center",
  },
  shadowImg: {
    height: 200,
    tintColor: "#fff",
  },
  switchContainer: {
    position: "absolute",
    top: 180,
    right: 30,
  },
  colorContainer: {
    flexDirection: "row",
    marginVertical: 20,
    gap: 5,
    justifyContent: "center",
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  addColor: {
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  brightnessContainer: {
    position: "absolute",
    top: -25,
    left: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  brightnessText: {
    fontSize: 52,
    fontWeight: "bold",
    marginBottom: 8,
  },
  brightnessLabel: {
    fontSize: 12,
    color: "#777",
  },
  sliderContainer: {
    alignContent: "center",
    justifyContent: "center",
    padding: 20,
    position: "absolute",
    bottom: 140,
    right: -10,
  },
  slider: {
    width: 250,
    height: 40,
  },
  scheduleButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    width: "70%",
  },
  scheduleText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
});

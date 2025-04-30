import React from "react";
import { Image, Text, StyleSheet, View } from "react-native";

interface InformationBarProps {
  imgSrc:
    | "weather-icon.png"
    | "water-percent.png"
    | "calendar-icon.png"
    | "sun-icon.png";
  text: string;
}

const InformationBar: React.FC<InformationBarProps> = ({ imgSrc, text }) => {
  let importImg;
  if (imgSrc === "weather-icon.png") {
    importImg = require("@/assets/images/icon/weather-icon.png");
  } else if (imgSrc === "water-percent.png") {
    importImg = require("@/assets/images/icon/water-percent.png");
  } else if (imgSrc === "calendar-icon.png")
    importImg = require("@/assets/images/icon/calendar-icon.png");
  else {
    importImg = require("@/assets/images/icon/sun-icon.png");
  }

  return (
    <View style={styles.container}>
      <Image source={importImg} style={styles.iconStyle} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
};

export default InformationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  infoText: {
    color: "white",
    fontSize: 14,
  },
});

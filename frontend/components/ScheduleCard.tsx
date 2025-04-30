import React, { useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

const ScheduleCard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon/sun-icon.png")}
        style={{ width: 50, height: 50 }}
      />
      <Text style={styles.cardText}>Morning</Text>
      <Switch
        trackColor={{ false: "#D1D1D6", true: "#A3BFFA" }}
        thumbColor={isEnabled ? "#FFFFFF" : "#F2F2F7"}
        ios_backgroundColor="#D1D1D6"
        onValueChange={() => setIsEnabled(!isEnabled)}
        value={isEnabled}
        style={styles.switch}
      />
    </View>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  container: {
    width: "32%",
    height: 150,
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    elevation: 10, // For Android shadow
  },
  cardText: {
    fontSize: 14,
  },
  switch: {
    transform: [{ scale: 1.2 }], // Makes the switch bigger
  },
});

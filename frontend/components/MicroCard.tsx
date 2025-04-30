import React from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PrimaryBtn from "@/components/PrimaryBtn";

const MicroCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name="microphone" size={72} color="#4f4f4f" />
      </View>
      <View style={{ paddingTop: 15 }}>
        <PrimaryBtn>Hold to speak</PrimaryBtn>
      </View>
    </View>
  );
};

export default MicroCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "#F5F5F7",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    padding: 16,
    // borderWidth: 2,
    elevation: 6, // For Android shadow
  },
});

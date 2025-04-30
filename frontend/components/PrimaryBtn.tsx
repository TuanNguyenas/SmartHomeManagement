import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

interface PrimaryBtnProps {
  children: any;
  onPress?: () => void;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ children, onPress }) => {
  let func = () => {
    console.log("Button pressed");
  };
  if (onPress) {
    func = onPress;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.primaryBtn}
        android_ripple={{ color: "#ddd" }}
        onPress={func}
      >
        <Text style={styles.primaryBtnText}>{children}</Text>
      </Pressable>
    </View>
  );
};

export default PrimaryBtn;

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    overflow: "hidden",
  },
  primaryBtn: {
    backgroundColor: Colors.primary800,
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

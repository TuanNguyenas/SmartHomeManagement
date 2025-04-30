import Title from "@/components/Title";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

interface HeaderProps {
  children: string;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={() => router.back()}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-back" size={18} color="#000000" />
      </Pressable>
      <Title>{children}</Title>
      <Text></Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    paddingTop: 40,
  },
});

import { Colors } from "@/constants/Colors";
import React from "react";

import { StyleSheet, Text, View } from "react-native";

interface TitleProps {
  children: React.ReactNode;
  ownStyle?: object | undefined;
}

const Title: React.FC<TitleProps> = ({ children, ownStyle = undefined }) => {
  return (
    <View>
      <Text style={[styles.titleStyle, ownStyle]}>{children}</Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.black600,
  },
});

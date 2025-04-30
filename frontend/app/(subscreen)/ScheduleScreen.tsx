import Header from "@/components/Header";
import ScheduleList from "@/components/ScheduleList";
import ScheduleType from "@/interface/schedule.interface";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const ScheduleScreen = () => {
  const { deviceId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScheduleList deviceId={deviceId as string} />
    </View>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

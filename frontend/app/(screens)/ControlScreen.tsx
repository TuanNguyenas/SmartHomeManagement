import Dialog from "@/components/Dialog";
import PrimaryBtn from "@/components/PrimaryBtn";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Title from "@/components/Title";
import Home from "@/interface/home.interface";
import Entypo from "@expo/vector-icons/Entypo";

import { router } from "expo-router";
import { useSelector } from "react-redux";

const ControlScreen = () => {
  const home_list: Home[] = useSelector((state: any) => state.user.homes);
  const [isAccess, setIsAccess] = useState(false);
  const [isOpenPrompt, setIsOpenPrompt] = useState(false);
  const info = useSelector((state: any) => state.user);
  // console.log("Info: ", info);

  const handleHomePress = (home: Home) => {
    router.push({
      pathname: "/RoomList",
      params: { devices: JSON.stringify(home.devices) },
    });
  };
  console.log("main home: ", home_list[0]);

  return (
    <View style={styles.container}>
      <Dialog
        modalVisible={isOpenPrompt}
        setIsAccess={setIsAccess}
        onModalVisibleChange={setIsOpenPrompt}
      />

      <Title ownStyle={styles.title}>Control Device</Title>
      <FlatList
        data={home_list}
        showsVerticalScrollIndicator={false}
        style={styles.homesContainer}
        contentContainerStyle={{
          gap: 13,
        }}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={[
                styles.homeCard,
                {
                  backgroundColor:
                    item.home_id === info.selectedHome ? "#5F99AE" : "#F5ECE0",
                },
              ]}
              onPress={() => handleHomePress(item)}
            >
              <View>
                <Text style={styles.homeCardTitle}>{item.home_name}</Text>
                <Text style={styles.homeCardText}>{item.serial_number}</Text>
              </View>
              <Text style={styles.homeCardText}>
                {item.devices.length} devices
              </Text>

              <View style={styles.iconWrapper}>
                <Entypo
                  name="dots-three-horizontal"
                  size={12}
                  color="#F5ECE0"
                />
              </View>
            </Pressable>
          );
        }}
      />
      <View style={styles.btnContainer}>
        <PrimaryBtn onPress={() => setIsOpenPrompt(true)}>
          Add Home Access Pin
        </PrimaryBtn>
      </View>
    </View>
  );
};

export default ControlScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  title: {
    paddingTop: 40,
  },
  homesContainer: {
    paddingHorizontal: 26,
    marginTop: 20,
    width: "100%",
  },
  homeCard: {
    width: "100%",
    height: 100,
    backgroundColor: "#5F99AE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  homeCardTitle: {
    width: "100%",
    color: "#F5ECE0",
    fontSize: 22,
    fontWeight: "bold",
  },
  homeCardText: {
    color: "#F5ECE0",
    fontSize: 14,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 4,
    borderColor: "#F5ECE0",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  btnContainer: {
    margin: 30,
  },
});

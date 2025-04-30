import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ImageBackground } from "react-native";
import { Colors } from "@/constants/Colors";
import InformationBar from "@/components/InformationBar";
import Title from "@/components/Title";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useSelector } from "react-redux";
import { mqttService } from "@/services/mqtt.service";
import Home from "@/interface/home.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import Members from "@/components/Members";

const getCurrentDate = () => {
  const date = new Date();

  // Array for weekday names and month names
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = date.getDate();
  let month = date.getMonth();
  let weekday = date.getDay();

  // Determine the correct suffix for the day (st, nd, rd, th)
  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"; // For 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const daySuffix = getDaySuffix(day);

  // Format the date string
  const dateStr = `${weekdayNames[weekday]}, ${monthNames[month]} ${day}${daySuffix}`;
  return dateStr;
};

const USERNAME = "John Doe";
const NOTIFICATION_COUNT = 3;

type WelcomeCardProps = {
  onScreen: "home" | "automation" | "user";
};
const WelcomeCard = (props: WelcomeCardProps) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string>("0");
  const [humidity, setHumidity] = useState<string>("0");
  const [light, setLight] = useState<string>("0");

  const selectedHome = useSelector((state: any) => state.user.selectedHome);
  const homes: Home[] = useSelector((state: any) => state.user.homes);
  const home: Home = homes.filter(
    (home: any) => home.home_id === selectedHome
  )[0];
  console.log(homes);

  useEffect(() => {
    if (home) {
      const client = mqttService.connect(
        home.home_name,
        home.aio_key,
        home.devices,
        (topic: string, message: string) => {
          console.log(topic, " ", message);
          if (topic === `${home.home_name}/feeds/cambienas`) {
            setLight(message);
          } else if (topic === `${home.home_name}/feeds/cambiennd`) {
            setTemperature(message);
          } else if (topic === `${home.home_name}/feeds/cambienda`) {
            setHumidity(message);
          }
        }
      );

      client.on("connect", () => {
        setConnected(true);
      });

      return () => {
        // mqttService.disconnect();
        // setConnected(false);
      };
    }
  }, [home]);

  const homeUI = (
    <>
      <Fontisto name="bell-alt" size={24} color={Colors.iconBackground} />
      {NOTIFICATION_COUNT > 0 && (
        <View style={styles.notificationCount}>
          <Text style={{ color: "white", fontSize: 12 }}>
            {NOTIFICATION_COUNT}
          </Text>
        </View>
      )}
    </>
  );

  const userUI = (
    <>
      {/* <AntDesign name="setting" size={24} color={Colors.iconBackground} /> */}
      <Text
        style={{
          color: Colors.iconBackground,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        Home: {home.home_name}
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imgBackground}
        source={require("@/assets/images/background/welcome-background.png")}
        resizeMode="contain"
      />
      <View style={styles.mainBarContainer}>
        <View id="show-in4" style={styles.infoContainer}>
          <InformationBar imgSrc="weather-icon.png" text={temperature} />
          <InformationBar imgSrc="water-percent.png" text={humidity} />
          <InformationBar imgSrc="sun-icon.png" text={light} />
          <InformationBar imgSrc="calendar-icon.png" text={getCurrentDate()} />
        </View>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImg}
            source={require("@/assets/images/icon/avatar.png")}
          />
        </View>
      </View>
      {props.onScreen !== "automation" ? (
        <View style={styles.nameContainer}>
          <Title ownStyle={{ color: "white" }}>Hi, {USERNAME}</Title>
          <View></View>
          {props.onScreen === "home" ? homeUI : userUI}
        </View>
      ) : (
        <Title ownStyle={{ color: "white", paddingHorizontal: 16 }}>
          Automation
        </Title>
      )}
      {props.onScreen === "user" && <Members />}
    </View>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,

    position: "absolute",
    bottom: "-15%", // Adjust based on your design
    right: "-10%",
    width: "80%", // Control how much space the image takes
    height: "80%",
  },
  container: {
    // flex: 1,
    height: "30%",
    width: "100%",
    backgroundColor: Colors.primary800,
    borderEndEndRadius: 20,
    borderStartEndRadius: 20,
  },
  mainBarContainer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 50,
  },
  avatarImg: {
    width: 40,
    height: 40,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  notificationCount: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    padding: 4,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: Colors.backgroundColor,
  },
});

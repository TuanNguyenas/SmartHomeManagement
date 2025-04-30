import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 55,
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.primary800 : "gray",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={20}
              color={focused ? Colors.primary800 : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ControlScreen"
        options={{
          title: "Control",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.primary800 : "gray",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Control
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={20}
              color={focused ? Colors.primary800 : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SmartDoorScreen"
        options={{
          title: "Smart Door",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.primary800 : "gray",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Smart Door
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="key"
              size={20}
              color={focused ? Colors.primary800 : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AutomationScreen"
        options={{
          title: "Automation",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.primary800 : "gray",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Automation
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="hdr-auto"
              size={20}
              color={focused ? Colors.primary800 : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="UserScreen"
        options={{
          title: "User",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.primary800 : "gray",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              User
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="user-alt"
              size={16}
              color={focused ? Colors.primary800 : "gray"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { device } from "../../backend/src/generated/client/index";

interface Item {
  id: number;
  content: string;
  is_read: boolean;
  device_id: number;
  notification_time: string;
}

const NotificationBoard = () => {
  const [notifications, setNotifications] = useState<Item[]>([]);
  const home = useSelector((state: any) => state.user.homes);
  const selectedHome = useSelector((state: any) => state.user.selectedHome);
  const filteredHome = useMemo(
    () => home.filter((h: any) => h.home_id === selectedHome),
    [home, selectedHome]
  );

  const deviceList = filteredHome.length > 0 ? home[0].devices : [];

  useEffect(() => {
    const callAPI = async () => {
      try {
        const deviceNotifications = await Promise.all(
          deviceList.map(async (device: { id: number }) => {
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/notification/${device.id}`
            );
            if (!response.ok) {
              console.error(
                `Error fetching notifications for device ${device.id}`
              );
              return [];
            }
            const responseJson = await response.json();
            return responseJson.metadata;
          })
        );

        const allNotifications = deviceNotifications.flat();
        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    callAPI();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Board</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.length === 0 ? (
          <Text>No notifications available</Text>
        ) : (
          notifications.map((item, index) => (
            <View key={index} style={styles.notificationItem}>
              <View style={styles.row}>
                <Text style={styles.boldText}>{item.content}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.notification_time).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.descriptionText}></Text>
                <Text style={styles.timeText}>
                  {new Date(item.notification_time).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationBoard;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    margin: 20,
    alignItems: "center",
    height: 200,
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    borderBottomWidth: 1,
    width: "100%",
    textAlign: "center",
    borderBottomColor: "#D1D1D6",
  },
  scrollContainer: {
    padding: 10,
    width: "100%",
  },
  notificationItem: {
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
  boldText: {
    fontWeight: "bold",
    flex: 2,
    color: "black",
  },
  dateText: {
    flex: 1,
    textAlign: "right",
    color: "black",
  },
  descriptionText: {
    flex: 2,
    color: "#666",
  },
  timeText: {
    flex: 1,
    textAlign: "right",
    color: "#666",
  },
});

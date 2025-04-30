import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  ListRenderItemInfo,
} from "react-native";
import { router } from "expo-router";
import ScheduleModal from "@/components/ScheduleModal";
import ScheduleType from "@/interface/schedule.interface";
import formatTime from "@/utils/handleTimeFormat";

const ScheduleList = ({ deviceId }: { deviceId: string }) => {
  const [schedule, setSchedule] = useState<ScheduleType[] | null>(null);
  // error for fetching schedule
  const [error, setError] = useState<string | null>(null);
  const [errorToggle, setErrorToggle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"update" | "add" | undefined>(undefined);

  useEffect(() => {
    async function fetchSchedule() {
      if (action === "update" || action === "add") return;
      try {
        setIsLoading(true);
        const response = await fetch(
          process.env.EXPO_PUBLIC_BACKEND_URL + "/schedule/device/" + deviceId
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedule of device " + deviceId);
        }
        const data = await response.json();
        setSchedule(data.metadata);
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching schedule: " + error);
        setIsLoading(false);
      }
    }
    fetchSchedule();
  }, [deviceId, action]);

  const [currTime, setCurrTime] = useState("00:00:AM");

  const toggleSwitch = async (item: ScheduleType, itemIdx: number) => {
    // FIX API: action
    setSchedule((prevSchedule) => {
      if (!prevSchedule) return null;
      const updatedSchedule = [...prevSchedule];
      updatedSchedule[itemIdx].is_enable = !updatedSchedule[itemIdx].is_enable;
      return updatedSchedule;
    });
    try {
      for (const actionDates of item.action_days) {
        const response = await fetch(
          process.env.EXPO_PUBLIC_BACKEND_URL +
            "/schedule/activate/" +
            deviceId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action_time: item.action_time,
              action_day: actionDates,
              // action: item.action,
              is_enable: item.is_enable,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to activate/de-activate schedule");
        }
      }
      console.log(`Schedule ${itemIdx} switch activated successfully`);
    } catch (error) {
      setSchedule((prevSchedule) => {
        if (!prevSchedule) return null;
        const updatedSchedule = [...prevSchedule];
        updatedSchedule[itemIdx].is_enable =
          !updatedSchedule[itemIdx].is_enable;
        return updatedSchedule;
      });
      console.log("Error activating/de-activating schedule: ", error);
      setErrorToggle(String(error));
    }
  };
  const deleteSchedule = async (item: ScheduleType) => {
    setSchedule((prevSchedule) => {
      if (!prevSchedule) return null;
      const updatedSchedule = [...prevSchedule];
      updatedSchedule.map((schedule, index) => {
        if (
          schedule.action_time === item.action_time &&
          schedule.action === item.action
        ) {
          updatedSchedule.splice(index, 1);
        }
      });
      return updatedSchedule;
    });
    try {
      for (const actionDate of item.action_days) {
        const response = await fetch(
          process.env.EXPO_PUBLIC_BACKEND_URL + "/schedule/" + deviceId,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action_time: item.action_time,
              action_day: actionDate,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete schedule");
        }
      }
      console.log("Schedule deleted successfully");
    } catch (error) {
      setSchedule((prevSchedule) => {
        if (!prevSchedule) return null;
        const updatedSchedule = [...prevSchedule];
        updatedSchedule.push(item);
        return updatedSchedule;
      });
      console.log("Error deleting schedule: ", error);
    }
  };

  const renderAlarmItem = ({
    item,
    index,
  }: ListRenderItemInfo<ScheduleType>) => {
    return (
      <Pressable
        onPress={() => {
          setAction("update");
          setCurrTime(formatTime(item.action_time));
        }}
        style={styles.alarmItem}
      >
        <View>
          <Text
            style={[
              styles.alarmTime,
              item.is_enable ? styles.activeText : styles.inactiveText,
            ]}
          >
            {formatTime(item.action_time)}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.alarmDays,
                {
                  marginRight: 10,
                  fontWeight: "500",
                  borderRightWidth: 1,
                  borderRightColor: "#ddd",
                  paddingRight: 10,
                },
              ]}
            >
              {item.action === "on" ? "Turn On" : "Turn Off"}
            </Text>
            <Text style={styles.alarmDays}>
              {item.action_days.length == 7
                ? "Everyday"
                : item.action_days.reduce((acc, value) => {
                    switch (value) {
                      case "monday":
                        return acc + "Mon ";
                      case "tuesday":
                        return acc + "Tue ";
                      case "wednesday":
                        return acc + "Wed ";
                      case "thursday":
                        return acc + "Thu ";
                      case "friday":
                        return acc + "Fri ";
                      case "saturday":
                        return acc + "Sat ";
                      case "sunday":
                        return acc + "Sun ";
                      default:
                        return acc;
                    }
                  }, "")}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Switch
            value={item.is_enable}
            onValueChange={() => toggleSwitch(item, index)}
          />
          <Pressable onPress={() => deleteSchedule(item)}>
            <Ionicons name="trash-bin-outline" size={18} color="grey" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={18} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alarm</Text>

        <TouchableOpacity onPress={() => setAction("add")}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <FlatList
            data={schedule}
            keyExtractor={(item) => String(item.device_id) + item.action_time}
            renderItem={renderAlarmItem}
          />
          {errorToggle && <Text>{errorToggle}</Text>}
        </>
      )}

      {action && (
        <ScheduleModal
          deviceId={deviceId}
          scheduleList={schedule}
          action={action}
          initTime={currTime}
          onModalVisibleChange={() => setAction(undefined)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "bold",
  },
  activeText: {
    color: "black",
  },
  inactiveText: {
    color: "gray",
  },
  alarmDays: {
    color: "gray",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 20,
  },
  daysContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  daySelected: {
    backgroundColor: "#007bff",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScheduleList;

import React, { useEffect } from "react";
import { View, StyleSheet, Image, FlatList, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useSelector } from "react-redux";
const Members = () => {
  const info = useSelector((state: any) => state.user);
  console.log("Info: ", info);
  const [users, setUsers] = React.useState<
    | [
        {
          email: string;
          first_name: string;
          last_name: string;
          id: number;
        }
      ]
    | null
  >(null);
  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await fetch(
          process.env.EXPO_PUBLIC_BACKEND_URL +
            "/user/home/" +
            info.selectedHome,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await res.json();
        console.log("Members data: ", data.users);
        for (let user of data.users) {
          const res = await fetch(
            process.env.EXPO_PUBLIC_BACKEND_URL + "/user/" + user.user_id,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch user info");
          }
          let userInfo = (await res.json()).user;
          console.log("User info: ", userInfo);
          // @ts-ignore
          setUsers((prev) => {
            if (!prev) return [userInfo];
            return [...prev, userInfo];
          });
        }
      } catch (error) {
        console.error("Error fetching members: ", error);
      }
    };
    getMembers();
  }, []);
  console.log("Members: ", users);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.memberContainer}
        data={users}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "flex-start",
          gap: 13,
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ alignItems: "center" }}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatarImg}
                  source={require("@/assets/images/icon/avatar.png")}
                />
              </View>
              <Text style={{ color: "white", fontSize: 12 }}>
                {item.first_name} {item.last_name}
              </Text>
            </View>
          );
        }}
      />
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}
      >
        <View style={styles.iconWrapper}>
          <Entypo name="plus" size={20} color="#fff" />
        </View>
      </View>
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 30,
  },
  memberContainer: {
    width: "70%",
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 50,
    height: "auto",
  },
  avatarImg: {
    width: 35,
    height: 35,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 2,
    borderWidth: 2,
    borderColor: "white",
  },
});

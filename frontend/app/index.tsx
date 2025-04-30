import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <View style={{ flex: 1 }}>
        <Image
          source={require("@/assets/images/background/welcome_image.png")}
        ></Image>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 32,
                color: "#1F41BB",
                fontWeight: "bold",
              }}
            >
              Manage Your Home
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 32,
                color: "#1F41BB",
                fontWeight: "bold",
              }}
            >
              with Just a Tap
            </Text>
          </View>
          <Text
            style={{
              maxWidth: 300,
              textAlign: "center",
              fontSize: 14,
              marginTop: 24,
            }}
          >
            Effortlessly manage lighting, security, and appliances from your
            phone or voice assistant.
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 100,
              gap: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#1F41BB",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 140,
                height: 50,
                borderRadius: 10,
              }}
              onPress={() => router.push("/(login)/LoginScreen")}
              // onPress={() => router.push("/(screens)/HomeScreen")}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 140,
                height: 50,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "black",
              }}
              onPress={() => router.push("/(login)/RegisterScreen")}
            >
              <Text
                style={{ color: "black", fontWeight: "bold", fontSize: 20 }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

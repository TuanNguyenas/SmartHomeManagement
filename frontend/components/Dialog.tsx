import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Title from "@/components/Title";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { addHome } from "@/redux/slices/userSlice";

interface DialogProps {
  modalVisible: boolean;
  onModalVisibleChange: (visible: boolean) => void;
  setIsAccess: (isAccess: boolean) => void;
}

const Dialog: React.FC<DialogProps> = ({
  modalVisible,
  onModalVisibleChange,
  setIsAccess,
}) => {
  const [messAndHomeSeries, setMessAndHomeSeries] = useState({
    homeSeries: "",
    message: "Enter Your home series",
  });

  const userId = useSelector((state: any) => state.user.user_id);

  const dispatch = useDispatch();

  const handleAddHome = async () => {
    const { homeSeries } = messAndHomeSeries;

    if (!homeSeries) {
      setMessAndHomeSeries({
        homeSeries: "",
        message: "Please enter a home series",
      });
      return;
    }

    try {
      const homeResponse: any = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/home/serial/" + homeSeries,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!homeResponse.ok) {
        throw new Error("Invalid home series");
      }

      const homeJson = await homeResponse.json();

      const homeId = homeJson.home.id;

      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/home/add",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            homeId: homeId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add user to home");
      }

      dispatch(addHome(homeJson.home));

      onModalVisibleChange(false);
      setIsAccess(true);
      Alert.alert("Success", "Home added successfully");
    } catch (error) {
      setMessAndHomeSeries({
        homeSeries: "",
        message: "Invalid Home Series",
      });
      Alert.alert("Error", "Failed to add home. Please try again.");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => onModalVisibleChange(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Title>Access Your Home</Title>

          {/* Home Icon */}
          <View style={styles.iconPlaceholder}>
            {/* Replace with actual image/icon */}
            <MaterialCommunityIcons
              name="home-automation"
              size={52}
              color={Colors.black600}
            />
          </View>

          {/* Input Field */}
          <TextInput
            style={styles.input}
            placeholder={messAndHomeSeries.message}
            value={messAndHomeSeries.homeSeries}
            onChangeText={(text) => {
              setMessAndHomeSeries({
                homeSeries: text,
                message: "Enter Your home series",
              });
            }}
          />

          {/* Buttons */}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.primary800 }]}
              onPress={handleAddHome}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors.backgroundColor },
              ]}
              onPress={() => onModalVisibleChange(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Dialog;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  iconPlaceholder: {
    marginTop: 20,
    width: 100,
    height: 100,
    backgroundColor: Colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 60,
    elevation: 4,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 40,
    backgroundColor: Colors.backgroundColor,
    elevation: 4,
    textAlign: "center",
  },
  btnContainer: {
    width: "80%",
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16 },
  cancelButtonText: { color: "#333", fontSize: 16 },
});

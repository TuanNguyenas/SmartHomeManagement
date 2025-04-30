import Title from "@/components/Title";
import React, { useState } from "react";
import { View, StyleSheet, Text, Keyboard, Pressable } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import Header from "@/components/Header";
import { useSelector } from "react-redux";

const KEYBOARD = [
  ["1", "4", "7", "Delete"],
  ["2", "5", "8", "0"],
  ["3", "6", "9", "Enter"],
];

const SmartDoorScreen = () => {
  const [isCorrectPass, setIsCorrectPass] = useState<boolean | null>(null);
  const [pass, setPass] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  let CORRECT_PASS = "111111";

  function handleKeyPress(key: string) {
    if (key === "Enter") {
      if (isChangingPassword) {
        CORRECT_PASS = newPassword;
        setIsChangingPassword(false);
        setNewPassword("");
        setIsCorrectPass(true);
      } else {
        if (pass === CORRECT_PASS) {
          setIsCorrectPass(true);
          Keyboard.dismiss();
        } else {
          setIsCorrectPass(false);
          setPass("");
        }
      }
    } else if (key === "Delete") {
      setPass(pass.slice(0, pass.length - 1));
    } else {
      if (pass.length < 6) setPass(pass + key);
    }
  }

  const welcomeMessage =
    isCorrectPass === null
      ? "Please enter password"
      : isCorrectPass
      ? "Welcome Home"
      : "Incorrect Password";
  const passArray = [...pass, "", "", "", "", "", ""].slice(0, 6);

  return (
    <View style={styles.container}>
      <Title ownStyle={styles.title}>Smart Door</Title>

      <View style={styles.indexInputs}>
        {passArray.map((char, index) => (
          <View key={index} style={styles.indexInputContainer}>
            <Text style={styles.indexInput}>{char}</Text>
          </View>
        ))}
      </View>

      <View id="keyboard" style={styles.keyboard}>
        {KEYBOARD.map((row, i) => (
          <View key={i} style={styles.keyboardCol}>
            {row.map((key, j) => (
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={j}
                onPress={() => handleKeyPress(key)}
                android_ripple={{ color: Colors.primary200 }}
              >
                <Text style={styles.keyboardText}>{key}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.btnContainer}>
        <Title ownStyle={{ color: Colors.primary800, fontSize: 18 }}>
          {welcomeMessage}
        </Title>
      </View>
    </View>
  );
};

export default SmartDoorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    paddingTop: 40,
  },

  indexInputs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    width: "100%",
    padding: 16,
    paddingTop: 80,
  },
  indexInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary800,
  },
  indexInputContainer: {
    borderBottomWidth: 2,
    borderColor: Colors.primary800,
    width: 35,
    alignItems: "center",
  },

  keyboard: {
    paddingTop: 60,
    width: "85%",
    height: "50%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  keyboardCol: {
    overflow: "hidden",
    flexDirection: "column",
    flex: 1,
  },
  keyboardText: {
    fontSize: 22,
    padding: 16,
    borderRadius: 8,
    borderColor: Colors.black400,
    fontWeight: "bold",
  },

  btnContainer: {
    marginTop: 100,
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: Colors.primary200,
    elevation: 3,
  },
});

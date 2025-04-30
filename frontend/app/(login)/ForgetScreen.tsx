import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ForgetScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleSendOTP = async () => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/otp/send-otp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        setCurrentStep(2);
      } else {
        console.error("Reset password failed:", result.message);
      }
    } catch (error) {
      console.error("Error during reset password:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/otp/verify-otp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Error during OTP verification", error);
    }
  };

  const handleSubmitPassword = async () => {
    if (password !== confirmPassword) {
      console.error("Password do not match");
      return;
    }

    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/user/reset-password",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        router.push("/LoginScreen");
      } else {
        console.error("Password reset failed:", result.message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/LoginScreen")}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back" size={25} color={"#1F41BB"} />
          <Text
            style={{ color: "#1F41BB", fontWeight: "semibold", fontSize: 16 }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText}>
        {currentStep === 1
          ? "Reset password"
          : currentStep === 2
          ? "Enter OTP"
          : "Set New Password"}
      </Text>

      <Text style={styles.subHeaderText}>
        {currentStep === 1
          ? "Enter the email associated with your account"
          : currentStep === 2
          ? "Enter the OTP sent to your email"
          : "Enter a new password"}
      </Text>

      <View style={styles.formContainer}>
        {currentStep === 1 && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setEmail(text)}
          />
        )}

        {currentStep === 2 && (
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="numeric"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setOtp(text)}
          />
        )}

        {currentStep === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </>
        )}
      </View>

      <View style={styles.loginButtonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={
            currentStep === 1
              ? handleSendOTP
              : currentStep === 2
              ? handleVerifyOTP
              : handleSubmitPassword
          }
        >
          <Text style={styles.loginButtonText}>
            {currentStep === 1
              ? "Send OTP"
              : currentStep === 2
              ? "Verify OTP"
              : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    color: "#1F41BB",
  },
  headerText: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F41BB",
  },
  subHeaderText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 60,
  },
  formContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    width: "80%",
    height: 60,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  loginButtonContainer: {
    alignItems: "center",
  },
  loginButton: {
    width: "80%",
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    backgroundColor: "#1F41BB",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

export default ForgetScreen;

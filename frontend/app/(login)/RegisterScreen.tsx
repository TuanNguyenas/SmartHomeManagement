import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RegisterFormValues from "@/interface/registerFormValues.interface";

const RegisterScreen = () => {
  const [state, setState] = useState<RegisterFormValues>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<RegisterFormValues>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const validateForm = (): boolean => {
    let valid = true;
    let newErrors = {
      ...errors,
    };

    Object.keys(state).forEach((key) => {
      if (!state[key as keyof RegisterFormValues]) {
        newErrors[key as keyof RegisterFormValues] = `${key} is required`;
        valid = false;
      }
    });

    if (state.password !== state.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
      valid = false;
    }
    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/user/signup",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: state.email,
            password: state.password,
            first_name: state.first_name,
            last_name: state.last_name,
          }),
        }
      );

      const result = await response.json();

      if (result.status === 201) {
        showSuccessModal();
      } else {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Network error. Please try again later.");
    }
  };

  const showSuccessModal = () => {
    setModal(true);
    setTimeout(() => {
      setSuccess(true);
    }, 2000);
    setTimeout(() => {
      setSuccess(false);
      setModal(false);
      router.push("/LoginScreen");
    }, 4000);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "bold",
              color: "#1F41BB",
            }}
          >
            Create Account
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "normal",
                maxWidth: 300,
                marginTop: 10,
              }}
            >
              Create an account so you can explore all the existing jobs
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#003f5c"
                onChangeText={(text) =>
                  setState((prevState) => ({ ...prevState, email: text }))
                }
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="First name"
                keyboardType="default"
                placeholderTextColor="#003f5c"
                onChangeText={(text) =>
                  setState((prevState) => ({ ...prevState, first_name: text }))
                }
              />
              {errors.first_name ? (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Last name"
                keyboardType="default"
                placeholderTextColor="#003f5c"
                onChangeText={(text) =>
                  setState((prevState) => ({ ...prevState, last_name: text }))
                }
              />
              {errors.last_name ? (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(text) =>
                  setState((prevState) => ({ ...prevState, password: text }))
                }
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Confirm Password"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(text) =>
                  setState((prevState) => ({
                    ...prevState,
                    confirm_password: text,
                  }))
                }
              />
              {errors.confirm_password ? (
                <Text style={styles.errorText}>{errors.confirm_password}</Text>
              ) : null}
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginText}>Sign up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
              <Text style={styles.create_new_button}>
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Success Modal */}
          <Modal visible={modal} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {loading ? (
                  <ActivityIndicator size="large" color="#1F41BB" />
                ) : success ? (
                  <>
                    <Text style={styles.modalText}>
                      Account created successfully!
                    </Text>
                    <Ionicons
                      name="checkmark-circle"
                      size={40}
                      color={"green"}
                    />
                  </>
                ) : (
                  <ActivityIndicator size="large" color="#1F41BB" />
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    width: "80%",
    height: 60,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 10,
  },
  TextInput: {
    height: 50,
    width: "100%",
    flex: 1,
    padding: 10,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    color: "#1F41BB",
    fontWeight: "bold",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 10,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#1F41BB",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  create_new_button: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F41BB",
  },
});

export default RegisterScreen;

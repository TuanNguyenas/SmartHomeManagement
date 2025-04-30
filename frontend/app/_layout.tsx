import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "expo-dev-client";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{ headerShown: false, animation: "ios_from_right" }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(login)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import HomePage from ".";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

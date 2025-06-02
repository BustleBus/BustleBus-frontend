import { Stack } from "expo-router";

import GlobalLoading from "@/components/GlobalLoading";

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <GlobalLoading />
    </>
  );
}

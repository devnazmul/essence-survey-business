import { Stack } from "expo-router";
import React from "react";
interface I_layoutProps {}
const _layout: React.FC<I_layoutProps> = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

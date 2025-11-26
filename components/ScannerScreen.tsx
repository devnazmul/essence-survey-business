import { CameraView } from "expo-camera";
import { useState } from "react";
import { View } from "react-native";

export const ScannerScreen = () => {
  const [facing, setFacing] = useState<"back" | "front">("back");
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <View style={{ flex: 1 }}>
      <CameraView className={`flex-1`} facing={facing} />
    </View>
  );
};

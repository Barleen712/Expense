import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
interface Gradient {
  title: string;
  handles?: () => void;
}
export default function GradientButton({ title, handles }: Gradient) {
  return (
    <TouchableOpacity onPress={handles} style={styles.gradient}>
      <LinearGradient colors={["#69AEA9", "#3F8782"]} style={[styles.gradient, { width: "100%" }]}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
interface CustomButton {
  title: string;
  bg: string;
  color: string;
  press?: () => void;
}
export function CustomButton({ title, bg, color, press }: CustomButton) {
  return (
    <TouchableOpacity
      style={{
        width: "90%",
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 10,
        backgroundColor: bg,
      }}
      onPress={press}
    >
      <Text style={{ color: color, fontSize: 20 }}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  gradient: {
    width: "90%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
  },

  signuptext: {
    color: "white",
    fontSize: 20,
  },
});

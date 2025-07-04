import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
interface Gradient {
  title: string;
  handles?: () => void;
}
export default function GradientButton({ title, handles }: Readonly<Gradient>) {
  return (
    <TouchableOpacity onPress={handles} style={{ width: "90%", marginTop: 10 }}>
      <LinearGradient
        colors={["#69AEA9", "#3F8782"]}
        style={[styles.gradient, { width: "100%", alignItems: "center", justifyContent: "center" }]}
      >
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
  disable?: boolean;
}
export function CustomButton({ title, bg, color, press, disable }: Readonly<CustomButton>) {
  return (
    <TouchableOpacity
      disabled={disable}
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
      <Text style={{ color: color, fontSize: 18, fontWeight: 600 }}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  gradient: {
    width: "90%",
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    width: "100%",
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: "600",
    height: "100%",
    lineHeight: 60,
  },

  signuptext: {
    color: "white",
    fontSize: 20,
  },
});

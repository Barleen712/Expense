import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../Screens/Stylesheet";

interface Header {
  title: string;
  press: () => void;
  bgcolor?: string;
  color?: string;
}

export default function Header({ title, press, bgcolor, color }: Readonly<Header>) {
  return (
    <View style={[styles.headerContainer, { backgroundColor: bgcolor ?? "white" }]}>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="arrow-back" size={30} color={color} onPress={press} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: color ?? "black" }]}>{title}</Text>
    </View>
  );
}

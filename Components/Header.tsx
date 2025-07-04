import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../Screens/Stylesheet";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";

interface Header {
  title: string;
  press: () => void;
  bgcolor?: string;
  color?: string;
  icon?: boolean;
  handleicon?: () => void;
  iconcolor?: string;
}

export default function Header({ title, press, bgcolor, color, icon, handleicon, iconcolor }: Readonly<Header>) {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  return (
    <View style={[styles.headerContainer, { backgroundColor: bgcolor || "white" }]}>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="arrow-back" size={30} color={color} onPress={press} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: color ?? "black", paddingRight: !icon ? 40 : 0, flex: 1.5 }]}>
        {title}
      </Text>
      {!!icon && (
        <TouchableOpacity style={styles.iconContainer} onPress={handleicon}>
          <Ionicons name="trash" size={26} color={!!iconcolor ? iconcolor : colors.color}></Ionicons>
        </TouchableOpacity>
      )}
    </View>
  );
}

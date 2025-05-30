import { StyleSheet, Platform } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    balance: {
      fontFamily: "Inter",
      fontWeight: Platform.OS === "ios" ? 500 : 600,
      fontSize: Platform.OS === "ios" ? 16 : 18,
      color: colors.color,
    },
    categoryText: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
    },
  });

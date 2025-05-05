import { StyleSheet, StatusBar, Platform } from "react-native";
export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    success: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundColor,
    },
    ForgotDes: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: Platform.OS === "ios" ? 24 : 28,
      color: colors.color,
      textAlign: "center",
    },
  });

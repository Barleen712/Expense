import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    accountbg: {
      flex: 0.3,
      alignItems: "center",
      justifyContent: "center",
    },
    accbalance: {
      position: "absolute",
      top: "20%",
      alignItems: "center",
      justifyContent: "center",
    },
    accTitle: {
      color: "rgba(145, 145, 159, 1)",
      fontWeight: 400,
    },
    accamount: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: Platform.OS === "ios" ? 40 : 44,
      color: colors.color,
    },
    bg: {
      width: "100%",
      height: "100%",
    },
    optionsText: {
      flex: 0.88,
      paddingLeft: 10,
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 16 : 18,
      fontWeight: "bold",
      color: colors.color,
    },
    Line: {
      width: "100%",
      height: 1,
      backgroundColor: colors.line,
    },
  });

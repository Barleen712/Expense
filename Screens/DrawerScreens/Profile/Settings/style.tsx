import { StyleSheet, Platform, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    items: {
      flexDirection: "row",
      padding: 15,
    },
    settings: {
      flex: 0.5,
      margin: Platform.OS === "ios" ? 20 : 15,
    },
    settingtitle: {
      flex: 0.5,
      alignItems: "center",
      fontSize: Platform.OS === "ios" ? 16 : 18,
      color: colors.color,
    },
    titleoption: {
      flex: 0.5,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    arrows: {
      flex: 0.05,
      justifyContent: "center",
    },
    settingtext: {
      color: "grey",
      fontWeight: 500,
      fontSize: RFValue(14),
      width: "100%",
      justifyContent: "flex-end",
      textAlign: "right",
    },
    accountbg: {
      flex: 0.3,
      alignItems: "center",
      justifyContent: "center",
    },
    Line: {
      width: "100%",
      height: 1,
      backgroundColor: colors.line,
    },
  });

import { StyleSheet } from "react-native";
import { Platform, StatusBar } from "react-native";
export default function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    scrollView: {
      flex: 1,
      //backgroundColor: "pink",
      width: "90%",
    },
    headTitle: {
      fontFamily: "Inter",
      width: "60%",
      fontSize: 20,
      fontWeight: 700,
      paddingTop: 10,
      borderBottomColor: colors.line,
      borderBottomWidth: 1,
      color: "rgba(42, 124, 118, 1)",
    },
    head: {
      marginTop: 10,
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 700,
      color: "rgba(42, 124, 118, 1)",
    },
    TermsView: {
      marginTop: 10,
    },
    description: {
      color: colors.color,
      fontSize: 14,
    },
  });
}

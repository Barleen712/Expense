import { StyleSheet, StatusBar, Platform } from "react-native";
export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    textinput: {
      width: "90%",
      height: 56,
      borderRadius: 16,
      borderColor: "rgba(133, 126, 126, 0.89)",
      borderWidth: 1,
      margin: 10,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      color: colors.color,
    },
    input: {
      alignItems: "center",
      justifyContent: "space-evenly",
      //  marginTop: Platform.OS === "ios" ? 20 : 30,
      width: "100%",
      marginTop: 10,
      height: "38%",
    },
    or: {
      color: "rgb(145, 145, 159)",
      margin: 10,
    },
    GoogleView: {
      flexDirection: "row",
      height: 56,
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      borderColor: "rgba(133, 126, 126, 0.89)",
      borderRadius: 16,
      borderWidth: 1,
    },
    Google: {
      height: 40,
      width: 40,
    },
    account: {
      margin: 15,
      color: colors.color,
    },
    span: {
      color: "rgb(57, 112, 109)",
      textDecorationLine: "underline",
    },
    textGoogle: {
      paddingLeft: 10,
      color: colors.color,
    },
  });

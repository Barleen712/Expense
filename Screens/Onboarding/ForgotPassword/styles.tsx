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
      height: 60,
      borderRadius: 16,
      borderColor: "rgba(241, 241, 250, 1)",
      borderWidth: 1,
      margin: 10,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      color: colors.color,
    },
    ForgotTitle: {
      flex: 2.5,
      justifyContent: "center",
      padding: 15,
      marginTop: 30,
    },
    email: {
      flex: 7.5,
      alignItems: "center",
    },
    ForgotDes: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: Platform.OS === "ios" ? 24 : 28,
      color: colors.color,
    },
    continue: {
      marginTop: 20,
      width: "100%",
      alignItems: "center",
    },
  });

import { StyleSheet, Platform } from "react-native";
export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor: colors.backgroundColor,
      alignItems: "center",
    },
    textinput: {
      width: "90%",
      height: "65%",
      borderRadius: 16,
      borderColor: "rgba(241, 241, 250, 1)",
      borderWidth: 1,
      padding: 15,
      margin: 12,
      color: colors.color,
      fontSize: 16,
    },
    input: {
      alignItems: "center",
      marginTop: Platform.OS === "ios" ? 30 : 40,
      width: "100%",
      height: "40%",
    },

    forgot: {
      marginTop: 25,
      color: " rgb(56, 88, 85)",
      fontSize: 18,
      fontWeight: 600,
    },
    account: {
      padding: 20,
      color: "rgba(145, 145, 159, 1)",
      fontSize: 16,
      fontWeight: 500,
    },
    span: {
      color: "rgb(57, 112, 109)",
      textDecorationLine: "underline",
      fontSize: 16,
      fontWeight: 500,
    },
    or: {
      color: "rgb(145, 145, 159)",
      margin: 10,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: 700,
    },
    GoogleView: {
      flexDirection: "row",
      height: 56,
      width: "90%",
      alignItems: "center",
      borderColor: "rgb(233, 233, 241)",
      borderRadius: 16,
      borderWidth: 1,
      justifyContent: "center",
    },
    Google: {
      height: 40,
      width: 40,
    },
    textGoogle: {
      color: colors.color,
      fontWeight: "bold",
      height: "100%",
      fontSize: 18,
      verticalAlign: "middle",
      alignItems: "center",
      width: "50%",
      textAlign: "center",
      lineHeight: 50,
    },
  });

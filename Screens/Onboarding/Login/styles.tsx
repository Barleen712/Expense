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
      height: 56,
      borderRadius: 16,
      borderColor: "rgba(133, 126, 126, 0.89)",
      borderWidth: 1,
      margin: 20,
      padding: 15,
      color: colors.color,
    },
    input: {
      alignItems: "center",
      marginTop: Platform.OS === "ios" ? 30 : 80,
      width: "100%",
      justifyContent: "space-evenly",
    },

    forgot: {
      margin: 20,
      color: " rgb(56, 88, 85)",
    },
    account: {
      padding: 20,
      color: colors.color,
    },
    span: {
      color: "rgb(57, 112, 109)",
      textDecorationLine: "underline",
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
      borderColor: "rgba(133, 126, 126, 0.89)",
      borderRadius: 16,
      borderWidth: 1,
      justifyContent: "center",
    },
    Google: {
      height: 40,
      width: 40,
    },
    textGoogle: {
      paddingLeft: 10,
      color: colors.color,
    },
  });

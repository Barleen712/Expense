import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    balanceView: {
      margin: 15,
    },
    balance: {
      fontFamily: "Inter",
      fontWeight: Platform.OS === "ios" ? 500 : 600,
      fontSize: Platform.OS === "ios" ? 16 : 18,
      color: "rgba(220, 234, 233, 0.6)",
    },
    amount: {
      fontFamily: "Inter",
      fontWeight: Platform.OS === "ios" ? 500 : 600,
      fontSize: Platform.OS === "ios" ? 60 : 64,
      color: "white",
    },
    selection: {
      backgroundColor: colors.backgroundColor,
      borderTopStartRadius: "10%",
      borderTopRightRadius: "10%",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: 5,
      paddingTop: 15,
      paddingBottom: 10,
    },
    textinput: {
      width: "90%",
      height: 56,
      color: "black",
      borderRadius: 16,
      borderColor: "rgba(133, 126, 126, 0.89)",
      borderWidth: 1,
      margin: 10,
      padding: 15,
      justifyContent: "center",
    },
    dropdown: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    add: {
      flex: 1,
      backgroundColor: "rgb(56, 88, 85)",
      justifyContent: "flex-end",
    },
    noti: {
      width: "85%",
    },
    notiDes: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 12 : 14,
      color: "grey",
      width: "65%",
    },
    switch: {
      transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
    notiView: {
      flexDirection: "row",
      width: "100%",
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    notiTitle: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 18 : 20,
      fontWeight: Platform.OS === "ios" ? 500 : "bold",
      color: colors.color,
    },
    quesLogout: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
      marginTop: Platform.OS === "ios" ? 18 : 20,
      color: "grey",
    },
    categoryText: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
    },
  });

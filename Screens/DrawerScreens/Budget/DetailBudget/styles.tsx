import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    Trash: {
      position: "absolute",
      right: "3%",
      // top: Platform.OS === "android" ? "5.5%" : "9%",
      top: Platform.OS === "ios" ? "10.5%" : "6.5%",
      width: 32,
      height: 32,
      // backgroundColor: "red",
    },
    typeText: {
      color: colors.color,
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
    },
    amountText: {
      color: colors.color,
      fontSize: 64,
      fontWeight: "bold",
      marginVertical: 10,
    },
    categoryText: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
    },
    limitexceed: {
      flexDirection: "row",
      backgroundColor: "rgba(253, 60, 74, 1)",
      width: "60%",
      marginTop: 30,
      height: "12%",
      borderRadius: 25,
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      paddingRight: 15,
    },
  });

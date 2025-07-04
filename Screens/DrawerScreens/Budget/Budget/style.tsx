import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgb(56, 88, 85)",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    expandedBackground: {
      backgroundColor: "rgba(213, 237, 230, 0.89)", // subtle green overlay
    },
    add: {
      flex: 1,
      backgroundColor: "rgb(56, 88, 85)",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    budgetMonth: {
      flexDirection: "row",
      marginBottom: 20,
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      // backgroundColor: "red",
    },
    budgetYear: {
      width: "25%",
      alignItems: "center",
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 25,
      paddingLeft: 20,
      padding: 3,
    },
    budgetMonthtext: {
      fontFamily: "Inter",
      fontWeight: Platform.OS === "ios" ? 500 : 600,
      fontSize: Platform.OS === "ios" ? 24 : 28,
      color: "white",
    },
    budgetView: {
      backgroundColor: colors.budgetbg,
      borderRadius: 24,

      // justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "85%",
    },
    budgetButton: {
      position: "absolute",
      bottom: Platform.OS === "android" ? "18%" : "13%",
      width: "100%",
      alignItems: "center",
    },
    budgetText: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
      color: "grey",
      width: "70%",
      textAlign: "center",
    },
    notiTitle: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 18 : 20,
      fontWeight: Platform.OS === "ios" ? 500 : "bold",
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

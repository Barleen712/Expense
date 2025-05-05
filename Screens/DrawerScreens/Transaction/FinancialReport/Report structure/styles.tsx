import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flex: 1,
      alignItems: "center",
    },
    cardMonth: {
      flex: 0.2,
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
    },
    MonthText: {
      color: colors.backgroundColor,
      fontSize: 24,
      fontWeight: "bold",
    },
    typeView: {
      flex: 0.3,
      alignItems: "center",
      justifyContent: "center",
    },
    typeText: {
      color: colors.backgroundColor,
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
    },
    amountText: {
      color: colors.backgroundColor,
      fontSize: 64,
      fontWeight: "bold",
      marginVertical: 10,
    },
    detailbox: {
      backgroundColor: colors.backgroundColor,
      borderRadius: 20,
      //  padding: 10,
      width: "90%",
      height: "70%",
      alignItems: "center",
      justifyContent: "center",
    },
    detailView: {
      flex: 0.5,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    detailText: {
      width: "80%",
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold",
      color: "#555",
    },
    category: {
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 16,
      fontWeight: "bold",
      //padding: Platform.OS === "ios" ? 17 : 10,
    },
    budgetReport: {
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: 40,
      paddingTop: 100,
    },
  });

import { StyleSheet, StatusBar, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    view: {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    image: {
      height: "50%",
      width: "75%",
      resizeMode: "contain",
    },
    title: {
      fontFamily: "Inter",
      fontWeight: 700,
      fontSize: Platform.OS === "android" ? RFValue(32) : RFValue(30),
      textAlign: "center",
      width: "80%",
      color: colors.color,
      marginTop: 20,
    },
    des: {
      width: Platform.OS === "android" ? "75%" : "80%",
      paddingTop: 10,
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: RFValue(16),
      textAlign: "center",
      color: " rgba(145, 145, 159, 1)",
    },
    paginationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 0.05,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 8,
      backgroundColor: "#C1C1C1",
    },
    activeDot: {
      backgroundColor: "rgb(42, 124, 118) ",
      width: Platform.OS === "ios" ? 15 : 14,
      height: Platform.OS === "ios" ? 15 : 14,
      borderRadius: 10,
    },
  });

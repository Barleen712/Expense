import { StyleSheet, StatusBar, Platform } from "react-native";
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
      fontSize: 32,
      textAlign: "center",
      width: "90%",
      color: colors.color,
      marginTop: 20,
    },
    des: {
      width: "75%",
      paddingTop: 10,
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 16,
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

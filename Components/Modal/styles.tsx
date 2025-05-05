import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "100%",
      height: "30%",
      backgroundColor: colors.backgroundColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
    },
    logout: {
      color: colors.color,
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 18 : 20,
      fontWeight: "bold",
      marginTop: 10,
    },
    quesLogout: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
      marginTop: Platform.OS === "ios" ? 18 : 20,
      color: "grey",
    },
    modalButton: {
      flexDirection: "row-reverse",
      width: "100%",
      height: "50%",
      padding: 20,
    },
    modalY: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    modalN: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainerTransaction: {
      width: "80%",
      height: "20%",
      backgroundColor: "white",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "40%",
    },
    deleteTrans: {
      width: 64,
      height: 60,
    },
  });

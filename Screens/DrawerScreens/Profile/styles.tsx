import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    expandedBackground: {
      backgroundColor: "rgba(213, 237, 230, 0.89)", // subtle green overlay
    },
    profile: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    userphoto: {
      flex: 0.25,
      alignItems: "center",
      justifyContent: "center",
    },
    ForgotDes: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: Platform.OS === "ios" ? 24 : 28,
      color: colors.color,
      // textAlign: "center",
      width: "100%",
    },
    details: {
      flex: 0.6,
      justifyContent: "center",
      alignItems: "flex-start",
      padding: 10,
    },
    icon: {
      flex: 0.15,
      justifyContent: "center",
      alignItems: "center",
    },
    username: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: 14,
      color: "rgba(145, 145, 159, 1)",
    },
    manageProfile: {
      justifyContent: "center",
      alignItems: "center",
    },
    options: {
      backgroundColor: colors.profileView,
      borderRadius: "5%",
      width: "90%",
      marginTop: Platform.OS === "ios" ? 10 : 29,
    },
    optionView: {
      flexDirection: "row",
      alignItems: "center",
      height: Platform.OS === "ios" ? 80 : 89,
      paddingLeft: 20,
    },
    icons: {
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      marginRight: 5,
      flex: 0.12,
      backgroundColor: colors.icon,
      borderRadius: 10,
    },
    logouticon: {
      padding: 5,
      flex: 0.12,
      marginRight: 5,
      borderRadius: 10,
    },
    Line: {
      width: "100%",
      height: 1,
      backgroundColor: colors.line,
    },
    optionsText: {
      flex: 0.88,
      paddingLeft: 10,
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 16 : 18,
      fontWeight: "bold",
      color: colors.color,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "100%",
      height: Platform.OS === "ios" ? "25%" : "28%",
      backgroundColor: colors.backgroundColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
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
    logout: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 18 : 20,
      fontWeight: "bold",
      marginTop: 10,
      color: colors.color,
    },
    quesLogout: {
      fontFamily: "Inter",
      fontSize: Platform.OS === "ios" ? 14 : 16,
      marginTop: Platform.OS === "ios" ? 18 : 20,
      color: "grey",
    },
  });

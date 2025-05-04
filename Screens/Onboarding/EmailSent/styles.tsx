import { StyleSheet,StatusBar,Platform } from "react-native";
export const getStyles=(colors: any) =>
StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  emailImgView: {
    flex: 0.45,
    alignItems: "center",
    justifyContent: "center",
  },
  emailDes: {
    flex: 0.55,
    alignItems: "center",
  },
  emailImg: {
    height: "80%",
    width: "80%",
    resizeMode: "contain",
  },
   ForgotDes: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: Platform.OS === "ios" ? 24 : 28,
      color: colors.color,
      textAlign: "center",
    },
  emailDesText: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 16 : 18,
    color: colors.color,
    padding: 30,
    textAlign: "center",
  },
  backToLogin: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",}

});

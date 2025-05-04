import { StyleSheet,StatusBar,Platform } from "react-native";
export const getStyles=(colors: any) =>
StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  textinput: {
    width: "90%",
    height: 56,
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    color:colors.color
  },
  ForgotTitle: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 30,
  },
  email: {
    flex: 7,
    alignItems: "center",
  },
  ForgotDes: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: Platform.OS === "ios" ? 24 : 28,
    color: colors.color,
    textAlign: "center",
  },

});

import { StyleSheet,StatusBar,Platform } from "react-native";
export const getStyles=(colors: any) =>
StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  image: {
    flex: 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  group2: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  group1: {
    height: "90%",
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
  },
  coint: {
    position: "absolute",
    bottom: "72%",
    left: Platform.OS === "ios" ? "18%" : "15%",
    height: "15%",
    width: "20%",
  },
  donut: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? "64%" : "63%",
    height: "15%",
    width: "20%",
    right: Platform.OS === "ios" ? "18%" : "15%",
  },
  save: {
    fontFamily: "Inter",
    fontWeight: 700,
    color: "rgb(67, 136, 131)",
    fontSize: Platform.OS === "ios" ? 30 : 30,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  getstarted: {
    flex: 0.35,
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    color: "white",
    fontSize: 20,
  },
  gradient: {
    width: "80%",
    height: "65%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(14, 36, 34)",
    elevation: 20,
  },
  login: {
    color: "rgb(57, 112, 109)",
  },
  title: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
  button: {
    flex: 0.35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 0.25,
    alignItems: "center",
  },
});

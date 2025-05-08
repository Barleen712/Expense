import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { backgroundColor: "#2A7C76", flex: 1, alignItems: "center", justifyContent: "center" },
  setup: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 10,
  },
  setuptext: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 18,
    color: "white",
    width: "90%",
    textAlign: "center",
  },
  keypad: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.5,
    //  backgroundColor: "red",
  },
});
export default styles;

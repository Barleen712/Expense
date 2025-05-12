import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";
const height = Dimensions.get("screen").height;
export default function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "#F9FAFB",
      //  backgroundColor: colors.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headView: {
      //  flex:0.3,
      marginTop: 20,
      backgroundColor: colors.backgroundColor,
      padding: 16,
      borderRadius: 20,
      marginVertical: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
      //  backgroundColor:"blue"
    },
    span: {
      fontWeight: "bold",
      fontFamily: "Inter",
      fontSize: 14,
    },
    scrollView: {
      //   flex:1,
      // alignItems:"center"
      width: "90%",
    },
    carousel: {
      //width:"90%",
      height: height * 0.55,
      marginTop: 20,
      backgroundColor: colors.backgroundColor,
      padding: 16,
      borderRadius: 20,
      marginVertical: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
      // backgroundColor:"red",
    },
    carouselItem: {
      alignItems: "center",
      flex: 1,
      justifyContent: "space-evenly",
      backgroundColor: "rgba(220, 234, 233, 0.6)",
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
    },
    offer: {
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: "bold",
      color: colors.color,
    },
  });
}

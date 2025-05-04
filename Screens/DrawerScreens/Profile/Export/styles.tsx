import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: colors.backgroundColor,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            },
            export: {
                width: "100%",
                marginTop: 30,
              },
              exportText: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 14 : 16,
                padding: 10,
                fontWeight: Platform.OS === "ios" ? 500 : "bold",
                color:colors.color
              },
              textinput1: {
                width: "90%",
                height: 56,
                color: "black",
                borderRadius: 16,
                borderColor: "rgba(133, 126, 126, 0.89)",
                borderWidth: 1,
                margin: 10,
                padding: 10,
              },
              textinput: {
                width: "90%",
                height: 56,
                color: "black",
                borderRadius: 16,
                borderColor: "rgba(133, 126, 126, 0.89)",
                borderWidth: 1,
                margin: 10,
                padding: 15,
                justifyContent: "center",
              },
              dropdownItems: {
                justifyContent: "center",
                height: 56,
              },
              arrowDown: {
                position: "absolute",
                right: "5%",
              },
              exportButton: {
                alignItems: "center",
                position: "absolute",
                bottom: "5%",
                width: "100%",
                justifyContent: "center",
              },
              Line: {
                width: "100%",
                height: 1,
                backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
              },
            },
            
    )
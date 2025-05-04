import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: colors.backgroundColor,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            },
            ForgotDes: {
                fontFamily: "Inter",
                fontWeight: "bold",
                fontSize: Platform.OS === "ios" ? 24 : 28,
                color: colors.color,
                textAlign: "center",
              },
              heading: {
                fontFamily: "Inter",
                fontWeight: "bold",
                fontSize: Platform.OS === "ios" ? 28 : 35,
                color:colors.color
              },
              Line: {
                width: "100%",
                height: 1,
                backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
              },
            },
            
    )
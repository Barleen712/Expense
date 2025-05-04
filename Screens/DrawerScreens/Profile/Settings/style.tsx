import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: colors.backgroundColor,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            },
            items: {
                flexDirection: "row",
                padding: 15,
              },
              settings: {
                flex: 0.5,
                margin: Platform.OS === "ios" ? 20 : 15,
              },
              settingtitle: {
                flex: 0.8,
                alignItems: "center",
                fontSize: Platform.OS === "ios" ? 16 : 18,
                color:colors.color,
              },
              titleoption: {
                flex: 0.15,
                justifyContent: "center",
              },
              arrows: {
                flex: 0.05,
                justifyContent: "center",
              },
              settingtext: {
                color: "grey",
              },
            accountbg: {
                flex: 0.3,
                alignItems: "center",
                justifyContent: "center",
              },
              Line: {
                width: "100%",
                height: 1,
                backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
              },
            },
            
    )
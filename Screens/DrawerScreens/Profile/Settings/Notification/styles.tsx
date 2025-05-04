import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: colors.backgroundColor,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            },
            notiView: {
                flexDirection: "row",
                width: "100%",
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
              },
              noti: {
                width: "85%",
              },
              switch: {
                transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1.5 }, { scaleY: 1.5 }],
              },
              notiTitle: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 18 : 20,
                fontWeight: Platform.OS === "ios" ? 500 : "bold",
                color:colors.color
              },
              notiDes: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 12 : 14,
                color: "grey",
                width: "65%",
              },
              Line: {
                width: "100%",
                height: 1,
                backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
              },
            },
            
    )
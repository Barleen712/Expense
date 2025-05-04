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
                itemTitle: {
                  flex: 0.8,
                  fontFamily: "Inter",
                  fontSize: Platform.OS === "ios" ? 14 : 16,
                  color:colors.color
                },
                itemSelected: {
                    flex: 0.2,
                    alignItems: "flex-end",
                  },
              Line: {
                width: "100%",
                height: 1,
                backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
              },
            },
            
    )
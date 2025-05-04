import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: "white",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
              },
              add: {
                flex: 1,
                backgroundColor: "rgb(56, 88, 85)",
                justifyContent: "flex-end",
              },
              budgetMonth: {
                flexDirection: "row",
                marginBottom: 40,
                justifyContent: "space-between",
                margin: 20,
              },
              budgetMonthtext: {
                fontFamily: "Inter",
                fontWeight: Platform.OS === "ios" ? 500 : 600,
                fontSize: Platform.OS === "ios" ? 24 : 28,
                color: "white",
              },
              budgetView: {
                backgroundColor: colors.backgroundColor,
                borderTopStartRadius: "5%",
                borderTopRightRadius: "5%",
                // justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "85%",
              },
              budgetButton: {
                position: "absolute",
                bottom: "15%",
                width: "100%",
                alignItems: "center",
              },
              budgetText: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 14 : 16,
                color: "grey",
                width: "70%",
                textAlign: "center",
              },
              notiTitle: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 18 : 20,
                fontWeight: Platform.OS === "ios" ? 500 : "bold",
              },
              quesLogout: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 14 : 16,
                marginTop: Platform.OS === "ios" ? 18 : 20,
                color: "grey",
              },
              categoryText: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 14 : 16,
              },
            },
            
    )
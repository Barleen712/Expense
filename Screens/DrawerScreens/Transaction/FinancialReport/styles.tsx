import { StyleSheet, Platform, StatusBar } from "react-native";

export const getStyles = (colors: any) =>
    StyleSheet.create(
        {
            reportGraph: {
                flexDirection: "row",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                height: "80%",
                width: "24%",
              },
              container: {
                flex: 1,
                backgroundColor: colors.backgroundColor,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
              },
              transactionHead: {
                flex: 0.08,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                margin: 10,
                marginLeft: 10,
              },
              dropdownItems: {
                justifyContent: "center",
                height: 56,
              },
              linechart: {
                flex: Platform.OS === "ios" ? 0.28 : 0.3,
              },
              setuptext: {
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 18,
                color: "white",
              },
              budgetText: {
                fontFamily: "Inter",
                fontSize: Platform.OS === "ios" ? 14 : 16,
                color: "grey",
                width: "70%",
                textAlign: "center",
              },
              lineGraph: {
                flex: 0.5,
                width: "100%",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              },
              ExpenseIncomeSelect: {
                flex: 0.1,
                marginTop: 10,
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              },
              SelectOptions: {
                borderRadius: 35,
            
                flexDirection: "row",
                height: "80%",
                width: "80%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.backgroundColor,
              },
              ExpenseSelect: {
                width: "50%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              },
              progressBarContainer: {
                height: 5,
                width: "100%",
                backgroundColor: "red",
                position: "absolute",
                top: 40,
                left: 0,
                margin: 40,
              },
              progressBar: {
                height: "100%",
                backgroundColor: "#fff",
              },
             
            },
            
    )
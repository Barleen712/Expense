import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import SelectImageWithDocumentPicker from "./Screens/DrawerScreens/Home/Attachment";
import Income from "./Screens/DrawerScreens/Home/Income";
import FinancialReport from "./Screens/DrawerScreens/Transaction/FinancialReport/FinancialReport";
import DonutChart from "./Screens/DrawerScreens/Transaction/FinancialReport/Donut";
import Transfer from "./Screens/DrawerScreens/Home/Transfer";
import Tabscreens from "./Navigation/TabNavigation";
import Expense from "./Screens/DrawerScreens/Home/Expense";
import DetailTransaction from "./Screens/DrawerScreens/Transaction/FinancialReport/DetailTransaction";
export default function App() {
  return (
    <NavigationContainer>
      <DetailTransaction />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

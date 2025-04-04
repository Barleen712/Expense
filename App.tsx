import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import SelectImageWithDocumentPicker from "./Screens/DrawerScreens/Home/Attachment";
import Income from "./Screens/DrawerScreens/Home/Income";
import FinancialReport from "./Screens/DrawerScreens/Transaction/FinancialReport/FinancialReport";
import DonutChart from "./Screens/DrawerScreens/Transaction/FinancialReport/Donut";
import Transfer from "./Screens/DrawerScreens/Home/Transfer";
import Tabscreens from "./Navigation/TabNavigation";
import Expense from "./Screens/DrawerScreens/Home/Expense";
import { DetailTransaction_Transfer } from "./Screens/DrawerScreens/Transaction/FinancialReport/DetailTransaction";
import { DetailTransaction_Income } from "./Screens/DrawerScreens/Transaction/FinancialReport/DetailTransaction";
import DetailTransaction_Expense from "./Screens/DrawerScreens/Transaction/FinancialReport/DetailTransaction";
export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </Provider>
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

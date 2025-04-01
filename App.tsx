import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import Settings from "./Screens/DrawerScreens/Profile/Settings";
import Account from "./Screens/DrawerScreens/Profile/Account";
import Tabscreens from "./Navigation/TabNavigation";
import Export1 from "./Screens/DrawerScreens/Profile/Export1";
import Currency from "./Screens/DrawerScreens/Profile/Currency";
import Theme from "./Screens/DrawerScreens/Profile/Theme";
import Notification from "./Screens/DrawerScreens/Profile/Notification";
import Header from "./Components/Header";
import CreateBudget from "./Screens/DrawerScreens/Budget/CreateBudget";
import DropDown from "./Components/DropDown";
import CustomSlider from "./Components/Slider";
import AddNewAccount from "./Screens/Onboarding/AddNewAccount";
import Months from "./Components/Month";
import Expense from "./Screens/DrawerScreens/Home/Expense";
import Income from "./Screens/DrawerScreens/Home/Income";
import SelectAttachment from "./Screens/DrawerScreens/Home/Attachment";
import Transfer from "./Screens/DrawerScreens/Home/Transfer";
import { FinancialReportQuote } from "./Screens/DrawerScreens/Transaction/FinancialReport/Report";
import { FinancialReportBudget } from "./Screens/DrawerScreens/Transaction/FinancialReport/Report";
export default function App() {
  return (
    <NavigationContainer>
      <Screens />
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

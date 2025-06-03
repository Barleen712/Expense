import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../Screens/Onboarding/Onboarding/Onboarding";
import Login from "../Screens/Onboarding/Login/Login";
import Setpin from "../Screens/Onboarding/Setpin/SetupPin01";
import SignUp from "../Screens/Onboarding/SignUp/Signup";
import ForgotPass from "../Screens/Onboarding/ForgotPassword/ForgotPassword";
import EmailSent from "../Screens/Onboarding/EmailSent/EmailSent";
import Success from "../Screens/Onboarding/Success/SignUp_success";
import Setpin02 from "../Screens/Onboarding/SetupPin02";
import Getstarted from "../Screens/Onboarding/GetStarted/GetStarted";
import Tabscreens from "./TabNavigation";
import StackParamList from "./StackList";
import Settings from "../Screens/DrawerScreens/Profile/Settings/Settings";
import Account from "../Screens/DrawerScreens/Profile/Account/Account";
import Export from "../Screens/DrawerScreens/Profile/Export/Export";
import Currency from "../Screens/DrawerScreens/Profile/Settings/Currency/Currency";
import Theme from "../Screens/DrawerScreens/Profile/Settings/Theme/Theme";
import Security from "../Screens/DrawerScreens/Profile/Settings/Security/Security";
import Language from "../Screens/DrawerScreens/Profile/Settings/Language/Language";
import Notification from "../Screens/DrawerScreens/Profile/Settings/Notification/Notification";
import DetailTransaction_Expense, {
  DetailTransaction_Income,
  DetailTransaction_Transfer,
} from "../Screens/DrawerScreens/Home/DetailTransaction/DetailTransaction";
import CreateBudget from "../Screens/DrawerScreens/Budget/CreateBudget/CreateBudget";

import Transfer from "../Screens/DrawerScreens/Home/Transfer/Transfer";
import FinancialReportExpense, {
  FinancialReportBudget,
  FinancialReportIncome,
  FinancialReportQuote,
} from "../Screens/DrawerScreens/Transaction/FinancialReport/Report structure/Report";
import FinancialReport from "../Screens/DrawerScreens/Transaction/FinancialReport/FinancialReport";
import DetailedBudget from "../Screens/DrawerScreens/Budget/DetailBudget/DetailedBudget";
import DetailAccount from "../Screens/DrawerScreens/Profile/Account/DetailAccount/DetailAccount";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRates } from "../Slice/CurrencySlice";
import DisplayNotification from "../Screens/DrawerScreens/Home/DisplayNotification";
import EnterPin from "../Screens/DrawerScreens/Home/EnterPin";
import { loadPreferences } from "../Slice/IncomeSlice";
import Terms_Condition from "../Screens/Onboarding/Terms&Services/Terms&Services";
import Privacy from "../Screens/Onboarding/Terms&Services/Privacy/Privacy";
import AboutUs from "../Screens/DrawerScreens/Profile/Settings/About/About";
import HelpScreen from "../Screens/DrawerScreens/Profile/Settings/Help/Help";
import Tutorial from "../Screens/DrawerScreens/Profile/Settings/Help/Tutorial";
import ForgotPin from "../Screens/DrawerScreens/Home/ForgotPin/ForgotPin";
import Transaction from "../Screens/DrawerScreens/Home/Transaction";

const Stack = createStackNavigator<StackParamList>();
export default function Screens() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadPreferences());
  }, []);
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPass} />
      <Stack.Screen name="EmailSent" component={EmailSent} />
      <Stack.Screen name="GetStarted" component={Getstarted} />
      <Stack.Screen name="Terms&Services" component={Terms_Condition} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="AllSet" component={Success} />
    </Stack.Navigator>
  );
}
const Stack2 = createStackNavigator<StackParamList>();
export function TabScreens({ initial = "EnterPin" }: Readonly<{ initial?: keyof StackParamList }>) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRates());
    dispatch(loadPreferences());
  }, []);
  return (
    <Stack2.Navigator initialRouteName={initial} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Setpin" component={Setpin} />
      <Stack.Screen name="Setpin1" component={Setpin02} />
      <Stack.Screen name="AllSet" component={Success} />
      <Stack.Screen name="EnterPin" component={EnterPin} />
      <Stack.Screen name="MainScreen" component={Tabscreens} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Export" component={Export} />
      <Stack.Screen name="Currency" component={Currency} />
      <Stack.Screen name="Theme" component={Theme} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="CreateBudget" component={CreateBudget} />
      <Stack.Screen name="Transfer" component={Transfer} />
      <Stack.Screen name="FinancialReportExpense" component={FinancialReportExpense} />
      <Stack.Screen name="FinancialReportIncome" component={FinancialReportIncome} />
      <Stack.Screen name="FinancialReportBudget" component={FinancialReportBudget} />
      <Stack.Screen name="FinancialReportQuote" component={FinancialReportQuote} />
      <Stack.Screen name="FinancialReport" component={FinancialReport} />
      <Stack.Screen name="DetailTransaction_Expense" component={DetailTransaction_Expense} />
      <Stack.Screen name="DetailTransaction_Income" component={DetailTransaction_Income} />
      <Stack.Screen name="DetailTransaction_Transfer" component={DetailTransaction_Transfer} />
      <Stack.Screen name="DetailBudget" component={DetailedBudget} />
      <Stack.Screen name="DetailAccount" component={DetailAccount} />
      <Stack.Screen name="DisplayNotification" component={DisplayNotification} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
      <Stack.Screen name="ForgotPin" component={ForgotPin} />
      <Stack.Screen name="Transaction" component={Transaction} />
    </Stack2.Navigator>
  );
}

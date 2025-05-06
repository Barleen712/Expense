import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../Screens/Onboarding/Onboarding/Onboarding";
import Login from "../Screens/Onboarding/Login/Login";
import Setpin from "../Screens/Onboarding/SetupPin01";
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
import Export1 from "../Screens/DrawerScreens/Profile/Export/Export1";
import Currency from "../Screens/DrawerScreens/Profile/Settings/Currency/Currency";
import Theme from "../Screens/DrawerScreens/Profile/Settings/Theme/Theme";
import Security from "../Screens/DrawerScreens/Profile/Settings/Security/Security";
import Language from "../Screens/DrawerScreens/Profile/Settings/Language/Language";
import Notification from "../Screens/DrawerScreens/Profile/Settings/Notification/Notification";
import DetailTransaction_Expense from "../Screens/DrawerScreens/Home/DetailTransaction/DetailTransaction";
import { DetailTransaction_Income } from "../Screens/DrawerScreens/Home/DetailTransaction/DetailTransaction";
import { DetailTransaction_Transfer } from "../Screens/DrawerScreens/Home/DetailTransaction/DetailTransaction";
import CreateBudget from "../Screens/DrawerScreens/Budget/CreateBudget/CreateBudget";
import Expense from "../Screens/DrawerScreens/Home/Expense/Expense";
import Income from "../Screens/DrawerScreens/Home/Income/Income";
import Transfer from "../Screens/DrawerScreens/Home/Transfer/Transfer";
import { handleBiometricAuth } from "../Screens/Constants";
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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { loadPreferences } from "../Slice/IncomeSlice";

const Stack = createStackNavigator<StackParamList>();
export default function Screens() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPass} />
      <Stack.Screen name="EmailSent" component={EmailSent} />
      <Stack.Screen name="GetStarted" component={Getstarted} />

      <Stack.Screen name="AllSet" component={Success} />
    </Stack.Navigator>
  );
}
const Stack2 = createStackNavigator<StackParamList>();
export function TabScreens({ initial = "EnterPin" }: { initial?: keyof StackParamList }) {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  useEffect(() => {
    // handleBiometricAuth(navigation);
    //dispatch(fetchRates());
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
      <Stack.Screen name="Export1" component={Export1} />
      <Stack.Screen name="Currency" component={Currency} />
      <Stack.Screen name="Theme" component={Theme} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="CreateBudget" component={CreateBudget} />
      <Stack.Screen name="Expense" component={Expense} />
      <Stack.Screen name="Income" component={Income} />
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
    </Stack2.Navigator>
  );
}

import React, { useContext, useState } from "react";
import { View, Text, Switch } from "react-native";
import { getStyles } from "./styles";

import Header from "../../../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import { useSelector, useDispatch } from "react-redux";
import { updateExceed, updateExpenseAlert } from "../../../../../Slice/IncomeSlice";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import { RootState } from "../../../../../Store/Store";
type NotificationProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: NotificationProp;
}
export default function Notification({ navigation }: Readonly<Props>) {
  const dispatch = useDispatch();
  const exceed = useSelector((state: RootState) => state.Money.exceedNotification);
  const expenseAlert = useSelector((state: RootState) => state.Money.expenseAlert);
  const [Budget, setBudget] = useState(exceed);
  const [Expense, setExpense] = useState(expenseAlert);
  function exceedFunc() {
    setBudget(!Budget);
    dispatch(updateExceed(!Budget));
  }
  function expenseAlertFunc() {
    setExpense(!Expense);
    dispatch(updateExpenseAlert(!Expense));
  }
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title="Notification"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line}></View>
      <View style={styles.notiView}>
        <View style={styles.noti}>
          <Text style={styles.notiTitle}>Expense Alert</Text>
          <Text style={styles.notiDes}>Get Notification about your expense</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
            value={Expense}
            thumbColor={"white"}
            onValueChange={expenseAlertFunc}
          />
        </View>
      </View>
      <View style={styles.Line}></View>
      <View style={styles.notiView}>
        <View style={styles.noti}>
          <Text style={styles.notiTitle}>Budget</Text>
          <Text style={styles.notiDes}>Get Notification when your budget exceeds limit</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
            value={Budget}
            thumbColor={"white"}
            onValueChange={exceedFunc}
          />
        </View>
      </View>
      <View style={styles.Line}></View>
    </View>
  );
}

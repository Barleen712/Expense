import React, { useEffect, useContext, useCallback } from "react";
import { View, Text, Dimensions, Image, BackHandler } from "react-native";
import styles from "../../../../Stylesheet";
import FaceCard from "./StructureReport";
import { CustomButton } from "../../../../../Components/CustomButton";
import { ProgressBar } from "react-native-paper";
const width = Dimensions.get("window").width;
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { StringConstants, categoryMap } from "../../../../Constants";
import { getStyles } from "./styles";
import {
  selectIncome,
  selectMonthlyExpenseTotals,
  groupedMonthlyExpensesAndTransfers,
  selectMonthlyIncomeTotals,
  selectExpensesAndTransfers,
  BudgetCategory,
  groupedMonthlyIncome,
} from "../../../../../Slice/Selectors";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { ThemeContext } from "../../../../../Context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

type Transactionprop = StackNavigationProp<StackParamList, "FinancialReportExpense">;
interface Props {
  navigation: Transactionprop;
}

export default function FinancialReportExpense({ navigation }: Props) {
  const grouped = useSelector(groupedMonthlyExpensesAndTransfers);
  const selectedKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const expense = grouped[selectedKey] || 0;
  const expenses = useSelector(selectMonthlyExpenseTotals);
  const total = expenses[selectedKey] || 0;
  const highestAmount = Math.max(...expense.map((t) => t.amount));
  const highestExpenseTransaction = expense.find((t) => t.amount === highestAmount);

  const handleSwipe = (evt) => {
    const { nativeEvent } = evt;
    const { pageX } = nativeEvent;
    const screenWidth = Dimensions.get("window").width;

    if (pageX < screenWidth * 0.5) {
      navigation.goBack();
    }
    if (pageX > screenWidth * 0.5) {
      navigation.navigate("FinancialReportIncome");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <View onStartShouldSetResponder={() => true} onResponderRelease={handleSwipe} style={{ flex: 1 }}>
      <FaceCard
        type="You Spend 💸"
        progress={0.25}
        amount={total}
        detail="and your biggest spending is from"
        category={highestExpenseTransaction.category}
        amount1={highestExpenseTransaction.amount}
        bg="red"
      />
    </View>
  );
}

export function FinancialReportIncome({ navigation }: Props) {
  const grouped = useSelector(groupedMonthlyIncome);
  const selectedKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const income = grouped[selectedKey] || 0;
  const expenses = useSelector(selectMonthlyIncomeTotals);
  const total = expenses[selectedKey] || 0;
  const highestAmount = Math.max(...income.map((t) => t.amount));
  const highestIncomeTransaction = income.find((t) => t.amount === highestAmount);

  const handleSwipe = (evt) => {
    const { nativeEvent } = evt;
    const { pageX } = nativeEvent;
    const screenWidth = Dimensions.get("window").width;

    if (pageX < screenWidth * 0.5) {
      navigation.goBack();
    }
    if (pageX > screenWidth * 0.5) {
      navigation.navigate("FinancialReportBudget");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <View onStartShouldSetResponder={() => true} onResponderRelease={handleSwipe} style={{ flex: 1 }}>
      <FaceCard
        type="You Earned 💰"
        progress={0.5}
        amount={total}
        detail="your biggest Income is from"
        category={highestIncomeTransaction.category}
        amount1={highestIncomeTransaction.amount}
        bg="rgba(0, 168, 107, 1)"
      />
    </View>
  );
}

export function FinancialReportBudget({ navigation }: Props) {
  const { t } = useTranslation();
  const budgets = useSelector(BudgetCategory);
  const selectedMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const monthBudgets = budgets[selectedMonthKey] || [];
  const exceed = monthBudgets.filter((item) => item.amountSpent > item.budgetvalue) || [];
  const totalBudgets = monthBudgets.length;
  const exceedBudgets = exceed.length;
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);

  const handleSwipe = (evt) => {
    const { nativeEvent } = evt;
    const { pageX } = nativeEvent;
    const screenWidth = Dimensions.get("window").width;

    if (pageX < screenWidth * 0.5) {
      navigation.goBack();
    }
    if (pageX > screenWidth * 0.5) {
      navigation.navigate("FinancialReportQuote");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <View onStartShouldSetResponder={() => true} onResponderRelease={handleSwipe} style={{ flex: 1 }}>
      <View style={[styles.card, { backgroundColor: "rgba(0, 119, 255, 1)", marginTop: 10 }]}>
        <View style={styles.cardMonth}>
          <ProgressBar
            progress={0.75}
            color={colors.backgroundColor}
            style={{
              backgroundColor: "rgba(214, 224, 220, 0.24)",
              width: width - 20,
              margin: 10,
            }}
          />
          <Text style={styles.MonthText}>{t("This Month")}</Text>
        </View>
        <View style={styles.budgetReport}>
          <Text style={[styles.detailText, { fontSize: 32, color: colors.backgroundColor }]}>
            {exceedBudgets} of {totalBudgets} {t(StringConstants.Budgetisexceedsthelimit)}
          </Text>
          <FlatList
            data={exceed}
            numColumns={2}
            contentContainerStyle={{ alignItems: "center" }}
            renderItem={({ item }) => {
              const Category = categoryMap[item.category === "Transfer" ? "Transfer" : item.category];
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.3,
                    padding: 10,
                    margin: 15,
                    backgroundColor: "rgba(189, 194, 194, 0.17)",
                    borderRadius: 20,
                  }}
                >
                  <Category width={40} height={40} />
                  <Text
                    style={{
                      paddingLeft: 5,
                      flexShrink: 1,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                      fontSize: 18,
                      color: colors.color,
                    }}
                  >
                    {t(item.category)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

export function FinancialReportQuote({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  const handleSwipe = (evt) => {
    const { nativeEvent } = evt;
    const { pageX } = nativeEvent;
    const screenWidth = Dimensions.get("window").width;

    if (pageX < screenWidth * 0.8) {
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <View onStartShouldSetResponder={() => true} onResponderRelease={handleSwipe} style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: "rgb(240, 225, 16)",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 30,
            marginTop: 10,
          },
        ]}
      >
        <ProgressBar
          progress={1}
          color={colors.backgroundColor}
          style={{
            backgroundColor: "rgba(214, 224, 220, 0.24)",
            width: width - 20,
            margin: 10,
          }}
        />
        <View>
          <Text style={[styles.typeText, { color: "black" }]}>“{t(StringConstants.Financialfreedon)}”</Text>
          <Text style={[styles.MonthText, { color: "black" }]}>-{t(StringConstants.RobertKiyosaki)}</Text>
        </View>
        <CustomButton
          title={t(StringConstants.Seethefulldetail)}
          bg="rgba(165, 168, 130, 0.5)"
          color="black"
          press={() => navigation.replace("FinancialReport")}
        />
      </View>
    </View>
  );
}

import React, { useCallback, useContext, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import CategoryList from "../../Transaction/FinancialReport/CategoryList";
import { getStyles } from "./style";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { currencies, Month } from "../../../Constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { selectBudget, CategoryExpense, BudgetCategory } from "../../../../Slice/Selectors";
import { useSelector } from "react-redux";
import { CATEGORY_COLORS } from "../../../Constants";
import { ProgressBar } from "react-native-paper";
const width = Dimensions.get("window").width * 0.8;
const date = new Date();
const MonthIndex = date.getMonth();
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";
import useBudgetListener from "../../../../Saga/BudgetSaga";
type Budgetprop = StackNavigationProp<StackParamList, "MainScreen">;
import { ActivityIndicator } from "react-native";
import { ThemeContext } from "../../../../Context/ThemeContext";
interface Props {
  navigation: Budgetprop;
}
export default function Budget({ navigation }: Props) {
  const loading = useSelector((state: RootState) => state.Money.loading);
  // if (loading)
  //   return (
  //     <View
  //       style={{
  //         height: "100%",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         backgroundColor: "rgba(0, 0, 0, 0.5)",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
  //     </View>
  //   );

  function handleprev() {
    setmonth(month - 1);
    if (month == 0) {
      setmonth(11);
    }
  }
  function handlenext() {
    setmonth(month + 1);
    if (month == 11) {
      setmonth(0);
    }
  }
  const Rates = useSelector((state) => state.Rates);
  const currency = Rates.selectedCurrencyCode;
  const convertRate = Rates.Rate[currency];
  const [month, setmonth] = useState(MonthIndex);
  const Budgetcat = useSelector(BudgetCategory);
  const { colors, setTheme, theme } = useContext(ThemeContext);
  const selectedMonthKey = `${date.getFullYear()}-${String(month + 1).padStart(2, "0")}`;
  const budgetDataForMonth = Budgetcat[selectedMonthKey] || [];
  const renderBudgetItems = useCallback(
    ({ item, index }) => {
      let remaining = item.budgetvalue - item.amountSpent;
      let progress = item.amountSpent / item.budgetvalue;
      if (remaining < 0) {
        remaining = 0;
        progress = 1;
      }
      const exceeded = item.amountSpent > item.budgetvalue;
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailBudget", {
              index: item.id,
              category: item.category,
              remaining: remaining,
              progress: progress,
              exceeded: exceeded,
              total: item.budgetvalue,
              percentage: item.alertPercent,
              alert: item.notification,
            })
          }
          style={{ margin: 10, backgroundColor: colors.budgetView, padding: 10, borderRadius: 15 }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0.5,
              padding: 5,
              borderRadius: 15,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "rgba(241, 241, 250, 1)",

              borderColor: "grey",
              alignSelf: "flex-start",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                backgroundColor: CATEGORY_COLORS[item.category],
                width: 12,
                height: 12,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                paddingLeft: 5,
                flexShrink: 1,
              }}
            >
              {t(item.category)}
            </Text>
          </View>
          <Text style={[styles.notiTitle, { color: colors.color, paddingTop: 5 }]}>
            {t("Remaining")} {currencies[currency]}
            {(remaining * convertRate).toFixed(2)}
          </Text>
          <ProgressBar
            progress={progress}
            color={CATEGORY_COLORS[item.category]}
            fillStyle={{
              borderRadius: 20,
            }}
            style={{
              backgroundColor: "rgba(214, 224, 220, 0.24)",
              width: width,
              height: 15,
              borderRadius: 20,
              marginTop: 5,
            }}
          />
          <Text style={[styles.quesLogout, { marginTop: 5 }]}>
            {currencies[currency]}
            {(item.amountSpent * convertRate).toFixed(2)} of {currencies[currency]}
            {(item.budgetvalue * convertRate).toFixed(2)}
          </Text>
          {exceeded && <Text style={[styles.categoryText, { color: "red" }]}>{t("You've exceeded the limit")}</Text>}
          {exceeded && (
            <AntDesign
              name="exclamationcircle"
              size={24}
              color="red"
              style={{ position: "absolute", right: "5%", top: "5%" }}
            />
          )}
        </TouchableOpacity>
      );
    },
    [navigation]
  );
  const { t } = useTranslation();

  if (loading) {
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  }

  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <View style={styles.add}>
        <View style={styles.budgetMonth}>
          <TouchableOpacity onPress={handleprev}>
            <Image source={require("../../../../assets/arrowLeftWhite.png")} />
          </TouchableOpacity>
          <Text style={styles.budgetMonthtext}>{t(Month[month])}</Text>
          <TouchableOpacity onPress={handlenext}>
            <Image source={require("../../../../assets/arrowRightWhite.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.budgetView}>
          {budgetDataForMonth.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.budgetText}>
                {t(StringConstants.Youdonthaveabudget)}.{"\n"}
                {t(StringConstants.Letmake)}.
              </Text>
            </View>
          ) : (
            <View style={{ height: "75%" }}>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
                style={{ width: "90%", flex: 6 }}
                data={budgetDataForMonth}
                showsVerticalScrollIndicator={false}
                renderItem={renderBudgetItems}
              />
            </View>
          )}
          <View style={styles.budgetButton}>
            <CustomButton
              title={t(StringConstants.CreateaBudget)}
              bg="rgb(42, 124, 118)"
              color="white"
              press={() =>
                navigation.navigate("CreateBudget", {
                  value: 0,
                  category: "Category",
                  alert: false,
                  percentage: 20,
                  edit: false,
                  header: "Create Budget",
                  month: month,
                  year: new Date().getFullYear(),
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

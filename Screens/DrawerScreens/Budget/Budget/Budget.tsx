import React, { useCallback, useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from "react-native";
import { getStyles } from "./style";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { currencies, Month, CATEGORY_COLORS, StringConstants } from "../../../Constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BudgetCategory } from "../../../../Slice/Selectors";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-native-paper";
import DropdownComponent from "../../../../Components/DropDown";
import { RootState } from "../../../../Store/Store";
import type { ListRenderItem } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { clearData } from "../../../../Slice/IncomeSlice";
import ArrowLeft from "../../../../assets/arrow-left.svg";
import ArrowRight from "../../../../assets/arrow-right.svg";
const width = Dimensions.get("window").width * 0.8;
const date = new Date();
const MonthIndex = date.getMonth();
type Budgetprop = StackNavigationProp<StackParamList, "MainScreen">;

type YearOption = { label: string; value: string };
let Year: YearOption[] = [];

for (let i = 0; i < 11; i++) {
  Year.push({ label: (2020 + i).toString(), value: (2020 + i).toString() });
}

interface Props {
  navigation: Budgetprop;
}
type BudgetItem = {
  id: number;
  category: string;
  budgetvalue: number;
  amountSpent: number;
  alertPercent: number;
  notification: boolean;
  year: number;
  Month: string;
};
export default function Budget({ navigation }: Readonly<Props>) {
  const { t } = useTranslation();
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const [month, setmonth] = useState(MonthIndex);
  const Budgetcat = useSelector(BudgetCategory);
  const [year, setyear] = useState("2025");
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const budgetDataForMonth = Budgetcat[monthKey] || [];
  function handleprev() {
    setmonth(month - 1);
    if (month == 0) {
      setyear((prevYear) => `${parseInt(prevYear, 10) - 1}`);
      setmonth(11);
    }
  }
  function handlenext() {
    setmonth(month + 1);
    if (month == 11) {
      setyear((prevYear) => `${parseInt(prevYear, 10) + 1}`);
      setmonth(0);
    }
  }
  const renderBudgetItems: ListRenderItem<BudgetItem> = useCallback(
    ({ item }) => {
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
              year: item.year,
              Month: month,
            })
          }
          style={{
            margin: 10,
            backgroundColor: colors.budgetView,
            padding: 10,
            borderRadius: 15,
            marginLeft: 15,
            marginRight: 15,
          }}
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
                fontWeight: 500,
                fontSize: 14,
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
    [navigation, currency, convertRate, t, colors]
  );

  const styles = getStyles(colors);
  clearData();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.add}>
        <DropdownComponent
          data={Year}
          value={year}
          name={year}
          color="white"
          styleButton={styles.budgetYear}
          onSelectItem={(item) => {
            setyear(item);
          }}
        />
        <View style={styles.budgetMonth}>
          <TouchableOpacity onPress={handleprev}>
            {/* <Image source={require("../../../../assets/arrowLeftWhite.png")} /> */}
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.budgetMonthtext}>{t(Month[month])}</Text>
          <TouchableOpacity onPress={handlenext}>
            {/* <Image source={require("../../../../assets/arrowRightWhite.png")} /> */}
            <ArrowRight />
          </TouchableOpacity>
        </View>
        <View style={styles.budgetView}>
          {budgetDataForMonth.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.budgetText}>
                {t(StringConstants.Youdonthaveabudget)}.{"\n"}
                {/* {t(StringConstants.Letmake)}. */}
              </Text>
            </View>
          ) : (
            <View style={{ height: "75%", width: "100%", alignItems: "center" }}>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
                style={{ width: "100%", flex: 6 }}
                data={budgetDataForMonth}
                showsVerticalScrollIndicator={false}
                renderItem={renderBudgetItems}
              />
            </View>
          )}
          <View style={styles.budgetButton}>
            {(Number(year) > new Date().getFullYear() ||
              (Number(year) === new Date().getFullYear() && month >= new Date().getMonth())) && (
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
                    year: Number(year),
                  })
                }
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

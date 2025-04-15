import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import styles from "../../../Stylesheet";
import FaceCard from "./StructureReport";
import { CustomButton } from "../../../../Components/CustomButton";
import { ProgressBar, MD3Colors } from "react-native-paper";
const width = Dimensions.get("window").width;
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";

type Transactionprop = StackNavigationProp<StackParamList, "FinancialReportExpense">;

interface Props {
  navigation: Transactionprop;
}
export default function FinancialReportExpense({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace("FinancialReportIncome");
    }, 3000);
    return () => clearTimeout(id);
  }, [navigation]);
  return (
    <FaceCard
      type="You Spend 💸"
      progress={0.25}
      amount="$332"
      detail="and your biggest spending is from"
      category="Shopping"
      amount1="$120"
      bg="red"
    ></FaceCard>
  );
}
export function FinancialReportIncome({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace("FinancialReportBudget");
    }, 3000);
    return () => clearTimeout(id);
  }, [navigation]);
  return (
    <FaceCard
      type="You Earned 💰"
      progress={0.5}
      amount="$6000"
      detail="your biggest Income is from"
      category="Salary"
      amount1="$5000"
      bg="rgba(0, 168, 107, 1)"
    ></FaceCard>
  );
}

export function FinancialReportBudget({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace("FinancialReportQuote");
    }, 3000);
    return () => clearTimeout(id);
  }, [navigation]);
  const { t } = useTranslation();
  return (
    <View style={[styles.card, { backgroundColor: "rgba(0, 119, 255, 1)" }]}>
      <View style={styles.cardMonth}>
        <ProgressBar
          progress={0.75}
          color="white"
          style={{
            backgroundColor: "rgba(214, 224, 220, 0.24)",
            width: width - 20,
            margin: 10,
          }}
        />
        <Text style={styles.MonthText}>{t("This Month")}</Text>
      </View>
      <View style={styles.budgetReport}>
        <Text style={[styles.detailText, { fontSize: 32, color: "white" }]}>
          2 of 12 {t(StringConstants.Budgetisexceedsthelimit)}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.category}>Shopping</Text>
          <Text style={styles.category}>Food</Text>
        </View>
      </View>
    </View>
  );
}
export function FinancialReportQuote({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "rgb(240, 225, 16)",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 30,
        },
      ]}
    >
      <ProgressBar
        progress={1}
        color="white"
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
  );
}

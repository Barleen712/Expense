import React, { useState } from "react";
import { View, Text, Image, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../Components/Header";
import styles from "../../../Stylesheet";
import CustomD from "../../../../Components/Practice";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LineChart } from "react-native-gifted-charts";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import DonutChart from "./Donut";
const data = [
  { percentage: 30, color: "rgba(66, 150, 144, 1)" },
  { percentage: 45, color: "rgba(78, 144, 114, 0.62)" },
  { percentage: 25, color: "rgb(176, 220, 217)" },
];
const Month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const lineData = [
  { value: 20 },
  { value: 45 },
  { value: 78 },
  { value: 80 },
  { value: 34 },
  { value: 78 },
  { value: 48 },
  { value: 88 },
  { value: 56 },
];
type financialProp = StackNavigationProp<StackParamList, "FinancialReport">;

interface Props {
  navigation: financialProp;
}

export default function FinancialReport({ navigation }: Props) {
  const [line, showline] = useState(true);
  const [pie, showpie] = useState(false);
  const [Expense, setExpense] = useState(true);
  const [Income, setIncome] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Financial Report" press={() => navigation.goBack()} />
        <View style={[styles.transactionHead]}>
          <CustomD
            name="Month"
            data={Month}
            styleButton={styles.homeMonth}
            styleItem={styles.dropdownItems}
            styleArrow={styles.homeArrow}
          />
          <TouchableOpacity style={styles.reportGraph}>
            <TouchableOpacity
              onPress={() => {
                showline(true);
                showpie(false);
              }}
              style={[styles.lineGraph, { backgroundColor: line ? "rgba(42, 124, 118, 1)" : "white" }]}
            >
              <Ionicons name="analytics" size={35} color={line ? "white" : "rgba(42, 124, 118, 1)"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.lineGraph, { backgroundColor: pie ? "rgba(42, 124, 118, 1)" : "white" }]}
              onPress={() => {
                showline(false);
                showpie(true);
              }}
            >
              <Fontisto name="pie-chart-1" size={24} color={pie ? "white" : "rgba(42, 124, 118, 1)"} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {line && (
          <View style={[styles.linechart]}>
            <Text style={[styles.typeText, { margin: 5, paddingLeft: 10, color: "black" }]}>$332</Text>
            <LineChart
              data={lineData}
              width={Dimensions.get("window").width}
              adjustToWidth={true}
              disableScroll
              yAxisLabelWidth={0}
              height={Dimensions.get("window").height * 0.2}
              startFillColor="rgb(78, 144, 114)" // Start gradient color
              endFillColor="white"
              initialSpacing={0}
              endSpacing={0}
              color="rgb(42, 124, 118)"
              thickness={8}
              hideDataPoints
              hideRules
              showVerticalLines={false}
              areaChart
              hideYAxisText
              hideAxesAndRules
              focusEnabled={false}
              curved
            />
          </View>
        )}
        {pie && (
          <View style={styles.linechart}>
            <DonutChart data={data} />
          </View>
        )}
        <View style={styles.ExpenseIncomeSelect}>
          <View style={styles.SelectOptions}>
            <TouchableOpacity
              onPress={() => {
                setExpense(true);
                setIncome(false);
              }}
              style={[
                styles.ExpenseSelect,
                { backgroundColor: Expense ? "rgba(42, 124, 118, 1)" : "rgba(220, 234, 233, 0.6)", borderRadius: 35 },
              ]}
            >
              <Text style={[styles.setuptext, { color: Expense ? "white" : "rgba(42, 124, 118, 1)" }]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setExpense(false);
                setIncome(true);
              }}
              style={[
                styles.ExpenseSelect,
                { backgroundColor: Income ? "rgba(42, 124, 118, 1)" : "rgba(220, 234, 233, 0.6)", borderRadius: 35 },
              ]}
            >
              <Text style={[styles.setuptext, { color: Income ? "white" : "rgba(42, 124, 118, 1)" }]}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("DetailTransaction_Expense")}
          style={{ backgroundColor: "rgba(220, 234, 233, 0.6)", width: "80%", margin: 10 }}
        >
          <Text>Shoping</Text>
          <Text>$120</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DetailTransaction_Income")}
          style={{ backgroundColor: "rgba(220, 234, 233, 0.6)", width: "80%", margin: 10 }}
        >
          <Text>Salary</Text>
          <Text>$5000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DetailTransaction_Transfer")}
          style={{ backgroundColor: "rgba(220, 234, 233, 0.6)", width: "80%", margin: 10 }}
        >
          <Text>Transfer</Text>
          <Text>$2000</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

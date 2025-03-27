import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../Stylesheet";
import Months from "../../../Components/Month";

export default function Home() {
  const [month, showmonth] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["rgba(255, 246, 229, 1)", "rgba(248, 237, 216, 0)"]} style={styles.homeHeadgradient}>
          <TouchableOpacity style={styles.homeMonth} onPress={() => showmonth(!month)}>
            <Image
              style={styles.homeArrow}
              source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowDown.png")}
            />
            <Text>October</Text>
          </TouchableOpacity>
          <Text style={styles.username}>Account Balance</Text>
          <Text style={styles.accamount}>$94500</Text>
          <View style={styles.homeHeadView}>
            <TouchableOpacity style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Income.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>Income</Text>
                <Text style={styles.budgetMonthtext}>$0.00</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Expense.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>Expense</Text>
                <Text style={styles.budgetMonthtext}>$0.00</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {month && (
          <View style={{ position: "absolute", top: Platform.OS === "ios" ? "10.5%" : "9.5%", width: "100%" }}>
            <Months />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

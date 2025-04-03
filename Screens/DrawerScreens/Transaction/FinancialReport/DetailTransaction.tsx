import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../../../Stylesheet";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../Components/Header";
export default function DetailTransaction({ navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header
          title="Detail Transaction"
          press={() => navigation.goBack()}
          bgcolor="rgba(253, 60, 74, 1)"
          color="white"
        />
        <View style={[styles.DetailHead, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
          <Text style={styles.number}>$120</Text>
          <Text style={[styles.notiTitle, { color: "white" }]}>Buy some grocery</Text>
          <Text style={[styles.MonthText, { fontSize: 14 }]}>Saturday 4 June 2021 16:20</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

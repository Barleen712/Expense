import React from "react";
import { View, Image, Text } from "react-native";
import styles from "../../Stylesheet";
import Header from "../../../Components/Header";
import { selectExpensesAndTransfers } from "../../../Slice/Selectors";
import { WalletMap } from "../../Constants";
import { useSelector } from "react-redux";
import TransactionList from "../Home/TransactionsList";

export default function DetailAccount({ navigation, route }) {
  const { wallet } = route.params;
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const walletCategory = expensesAndTransfers.filter((item) => item.wallet === wallet);
  return (
    <View style={styles.container}>
      <Header title="Detail Account" press={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: "center", paddingTop: 20 }}>
        <Image style={{ width: 70, height: 70 }} source={WalletMap[wallet]}></Image>

        <Text style={[styles.ForgotDes, { paddingTop: 10 }]}>{wallet}</Text>
        <Text style={[styles.heading, { paddingTop: 10 }]}>$2400</Text>
        <View style={{ flex: 0.1, width: "90%", justifyContent: "center", marginTop: 50 }}>
          <Text style={styles.optionsText}>Today</Text>
        </View>
        <TransactionList data={walletCategory} />
      </View>
    </View>
  );
}

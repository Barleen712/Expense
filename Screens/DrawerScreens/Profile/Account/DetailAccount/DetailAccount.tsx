import React, { useContext } from "react";
import { View, Image, Text, SafeAreaView } from "react-native";
import { getStyles } from "./styles";
import Header from "../../../../../Components/Header";
import { selectExpensesAndTransfers } from "../../../../../Slice/Selectors";
import { WalletMap } from "../../../../Constants";
import { useSelector } from "react-redux";
import TransactionList from "../../../Home/TransactionList/TransactionsList";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";

export default function DetailAccount({ navigation, route }: { navigation: any; route: any }) {
  const { wallet } = route.params;
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const walletCategory = expensesAndTransfers
    .filter((item) => item.wallet === wallet && new Date(item.Date) <= new Date())
    .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t("Detail Account")}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={{ flex: 1, alignItems: "center", paddingTop: 20 }}>
        <View style={{ backgroundColor: "white", padding: 5, width: 100, alignItems: "center", borderRadius: 10 }}>
          <Image
            style={{ width: 70, height: 70 }}
            source={typeof WalletMap[wallet] === "string" ? { uri: WalletMap[wallet] } : WalletMap[wallet]}
          />
        </View>

        <Text style={[styles.ForgotDes, { paddingTop: 10 }]}>{t(wallet)}</Text>
        <Text style={[styles.heading, { paddingTop: 10 }]}>$2400</Text>
        <View style={{ flex: 0.1, width: "90%", justifyContent: "center", marginTop: 50 }}></View>
        <TransactionList data={walletCategory} />
      </View>
    </SafeAreaView>
  );
}

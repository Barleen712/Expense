import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import { getStyles } from "./styles";

import Header from "../../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { WalletMap, StringConstants } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
type AccountProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: AccountProp;
}
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay"];
export default function Account({ navigation }: Readonly<Props>) {
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(StringConstants.Account)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.accountbg}>
        <View style={styles.accbalance}>
          <Text style={styles.accTitle}>{t(StringConstants.AccountBalance)}</Text>
          <Text style={styles.accamount}>$94500</Text>
        </View>
        <ImageBackground style={styles.bg} source={require("../../../../assets/BG.png")} />
      </View>
      <View style={{ flex: 0.7, marginTop: 30 }}>
        <FlatList
          data={wallet}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("DetailAccount", { wallet: item })}
                style={{
                  flexDirection: "row",
                  margin: 15,
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 10,
                  paddingRight: 30,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 50,
                      height: 45,
                      borderRadius: 10,
                      backgroundColor: "rgba(241, 241, 250, 1)",
                      padding: 5,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={typeof WalletMap[item] === "number" ? WalletMap[item] : { uri: WalletMap[item] }}
                    />
                  </View>
                  <Text style={styles.optionsText}>{t(item)}</Text>
                </View>
                <Text style={[styles.optionsText, { flex: 0 }]}>$2400</Text>
              </TouchableOpacity>
              <View style={styles.Line}></View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

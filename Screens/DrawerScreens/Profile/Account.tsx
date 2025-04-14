import React from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import Header from "../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { WalletMap } from "../../Constants";
type AccountProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: AccountProp;
}
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay"];
export default function Account({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header title="Account" press={() => navigation.goBack()} />
      <View style={styles.accountbg}>
        <View style={styles.accbalance}>
          <Text style={styles.accTitle}>Account Balance</Text>
          <Text style={styles.accamount}>$94500</Text>
        </View>
        <ImageBackground
          style={styles.bg}
          source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/BG.png")}
        />
      </View>
      <View style={{ flex: 0.7, marginTop: 30 }}>
        <FlatList
          data={wallet}
          // ItemSeparatorComponent={
          //   <View style={styles.Line}></View>
          // }
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
                    <Image style={{ width: 40, height: 40 }} source={WalletMap[item]}></Image>
                  </View>
                  <Text style={styles.optionsText}>{item}</Text>
                </View>
                <Text style={[styles.optionsText, { flex: 0 }]}>$400</Text>
              </TouchableOpacity>
              <View style={styles.Line}></View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

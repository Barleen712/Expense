import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { fetchRates } from "../../../Slice/CurrencySlice";
import { useDispatch, useSelector } from "react-redux";
import { setCurrencycode } from "../../../Slice/CurrencySlice";
import { changeCurrency } from "../../../Slice/IncomeSlice";

type CurrencyProp = StackNavigationProp<StackParamList, "Currency">;

interface Props {
  navigation: CurrencyProp;
}
export default function Currency({ navigation }: Props) {
  const currencies = [
    { name: "Australia", code: "AUD" },
    { name: "Canada", code: "CAD" },
    { name: "India", code: "INR" },
    { name: "Pound", code: "GBP" },
    { name: "Russia", code: "RUB" },
    { name: "United Stated", code: "USD" },
  ];
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.Money.preferences.currency);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency.theme);
  // useEffect(() => {
  //   dispatch(fetchRates());
  // }, []);
  return (
    <View style={styles.container}>
      <Header title="Currency" press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelectedCurrency(item.code);
                dispatch(setCurrencycode(item.code));
                dispatch(changeCurrency({ theme: item.code }));
              }}
              style={styles.items}
            >
              <Text style={styles.itemTitle}>
                {item.name} ({item.code})
              </Text>
              {selectedCurrency === item.code && (
                <View style={styles.itemSelected}>
                  <Ionicons name="checkmark-circle" size={20} color="green"></Ionicons>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.Line}></View>
          </View>
        )}
      />
    </View>
  );
}

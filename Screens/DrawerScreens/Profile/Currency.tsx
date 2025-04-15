import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { fetchRates } from "../../../Slice/CurrencySlice";
import { useDispatch } from "react-redux";
type CurrencyProp = StackNavigationProp<StackParamList, "Currency">;

interface Props {
  navigation: CurrencyProp;
}
export default function Currency({ navigation }: Props) {
  const currencies = [
    { name: "Germany", code: "EUR" },
    { name: "India", code: "INR" },
    { name: "Indonesia", code: "IDR" },
    { name: "Japan", code: "JPR" },
    { name: "Koria", code: "WON" },
    { name: "Russia", code: "RUB" },
    { name: "United Stated", code: "USD" },
  ];
  const dispatch = useDispatch();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

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
                dispatch(fetchRates());
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

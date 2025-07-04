import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { getStyles } from "../Language/styles";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrency, updatePreferences } from "../../../../../Slice/IncomeSlice";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import { RootState } from "../../../../../Store/Store";

type CurrencyProp = StackNavigationProp<StackParamList, "Currency">;

interface Props {
  navigation: CurrencyProp;
}
export default function Currency({ navigation }: Readonly<Props>) {
  const currencies = [
    { name: "Australia", code: "AUD" },
    { name: "Canada", code: "CAD" },
    { name: "India", code: "INR" },
    { name: "Pound", code: "GBP" },
    { name: "Russia", code: "RUB" },
    { name: "United Stated", code: "USD" },
  ];
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency);
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Currency"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        bounces={false}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelectedCurrency(item.code);
                dispatch(changeCurrency(item.code));
                dispatch(updatePreferences("currency", item.code));
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
    </SafeAreaView>
  );
}

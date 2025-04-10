import React from "react";
import { FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import styles from "../../Stylesheet";
import { categoryMap } from "../../Constants";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../../Slice/Selectors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";

interface TransactionListProps {
  data: Array<{
    key: string;
    category: string;
    description: string;
    moneyCategory: "Income" | "Expense" | "Transfer";
    amount: number;
    wallet: string;
  }>;
}

export default function TransactionList({ data }: TransactionListProps) {
  const navigation = useNavigation();
  function navigateFunc({ index }) {
    if (data[index].moneyCategory === "Income") navigation.navigate("DetailTransaction_Income", { value: data[index] });
    else if (data[index].moneyCategory === "Expense")
      navigation.navigate("DetailTransaction_Expense", { value: data[index] });
    else navigation.navigate("DetailTransaction_Transfer", { value: data[index] });
  }

  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      style={{ width: "90%", flex: 6 }}
      data={data}
      initialNumToRender={3}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const date = new Date(item.key);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format

        const formattedTime = `${hours}:${minutes} ${meridiem}`;
        return (
          <TouchableOpacity
            onPress={() => navigateFunc({ index })}
            style={{
              margin: 4,
              backgroundColor: "rgba(237, 234, 234, 0.28)",
              height: 80,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ margin: 10 }}>
              <Image
                style={{ width: 60, height: 60 }}
                source={categoryMap[item.moneyCategory === "Transfer" ? item.moneyCategory : item.category]}
              />
            </View>
            <View style={{ width: "54%", padding: 5 }}>
              <Text style={[styles.balance, { color: "black", marginTop: 15 }]}>{item.category}</Text>
              <Text style={[styles.categoryText, { color: "rgba(145, 145, 159, 1)", marginTop: 10 }]}>
                {item.description}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      item.moneyCategory === "Income"
                        ? "rgba(0, 203, 179, 1)"
                        : item.moneyCategory === "Expense"
                        ? "rgba(253, 60, 74, 1)"
                        : "rgba(0, 119, 255, 1)",
                  },
                ]}
              >
                {item.moneyCategory === "Income" ? "+" : "-"}${item.amount}
              </Text>
              <Text>{formattedTime}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

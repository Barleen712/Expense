import React from "react";
import { FlatList, View, Image, Text, TouchableOpacity, SectionList } from "react-native";
import styles from "../../Stylesheet";
import { categoryMap, currencies } from "../../Constants";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../../Slice/Selectors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

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
  const Rates = useSelector((state) => state.Rates);
  const currency = Rates.selectedCurrencyCode;
  const convertRate = Rates.Rate[currency];
  const navigation = useNavigation();
  function navigateFunc({ item }) {
    if (item.moneyCategory === "Income") navigation.navigate("DetailTransaction_Income", { value: item });
    else if (item.moneyCategory === "Expense") navigation.navigate("DetailTransaction_Expense", { value: item });
    else navigation.navigate("DetailTransaction_Transfer", { value: item });
  }
  const { t } = useTranslation();
  const isToday = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate.toDateString() === today.toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = new Date(date);
    return targetDate.toDateString() === yesterday.toDateString();
  };

  const formatDate = (date) => {
    if (isToday(date)) return "Today";
    else if (isYesterday(date)) return "Yesterday";
    else return format(new Date(date), "MMM dd, yyyy");
  };

  const groupedData = data.reduce((acc, item) => {
    const formattedDate = formatDate(item.Date);
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedData).map((date) => ({
    title: date,
    data: groupedData[date],
  }));

  const renderItem = ({ item }) => {
    const date = new Date(item.Date);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${meridiem}`;

    return (
      <TouchableOpacity
        onPress={() => navigateFunc({ item })}
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
        <View style={{ width: "52%", justifyContent: "space-between", height: "70%" }}>
          <Text style={[styles.balance, { color: "black" }]}>{t(item.category)}</Text>
          <Text style={[styles.categoryText, { color: "rgba(145, 145, 159, 1)" }]} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
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
            {item.moneyCategory === "Income" ? "+" : "-"}
            {currencies[currency]}
            {(item.amount * convertRate).toFixed(2)}
          </Text>
          <Text style={{ color: "rgba(145, 145, 159, 1)" }}>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SectionList
      sections={sections}
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item.id.toString() + index.toString()}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <View>
          <Text>{t(section.title)}</Text>
        </View>
      )}
    />
  );
  // <FlatList
  //   contentContainerStyle={{
  //     paddingBottom: 50,
  //   }}
  //   style={{ width: "90%", flex: 6 }}
  //   data={data}
  //   initialNumToRender={3}
  //   showsVerticalScrollIndicator={false}
  //   renderItem={({ item}) => {
  //     const date = new Date(item.Date);
  //     let hours = date.getHours();
  //     const minutes = date.getMinutes().toString().padStart(2, "0");
  //     const meridiem = hours >= 12 ? "PM" : "AM";
  //     hours = hours % 12 || 12; // Convert to 12-hour format

  //     const formattedTime = `${hours}:${minutes} ${meridiem}`;
  //     return (
  //       <TouchableOpacity
  //         onPress={() => navigateFunc({ item})}
  //         style={{
  //           margin: 4,
  //           backgroundColor: "rgba(237, 234, 234, 0.28)",
  //           height: 80,
  //           borderRadius: 20,
  //           flexDirection: "row",
  //           alignItems: "center",
  //         }}
  //       >
  //         <View style={{ margin: 10 }}>
  //           <Image
  //             style={{ width: 60, height: 60 }}
  //             source={categoryMap[item.moneyCategory === "Transfer" ? item.moneyCategory : item.category]}
  //           />
  //         </View>
  //         <View style={{ width: "54%", padding: 5 }}>
  //           <Text style={[styles.balance, { color: "black", marginTop: 15 }]}>{t(item.category)}</Text>
  //           <Text style={[styles.categoryText, { color: "rgba(145, 145, 159, 1)", marginTop: 10 }]}>
  //             {item.description}
  //           </Text>
  //         </View>
  //         <View style={{ alignItems: "flex-end" }}>
  //           <Text
  //             style={[
  //               styles.categoryText,
  //               {
  //                 color:
  //                   item.moneyCategory === "Income"
  //                     ? "rgba(0, 203, 179, 1)"
  //                     : item.moneyCategory === "Expense"
  //                     ? "rgba(253, 60, 74, 1)"
  //                     : "rgba(0, 119, 255, 1)",
  //               },
  //             ]}
  //           >
  //             {item.moneyCategory === "Income" ? "+" : "-"}
  //             {currencies[currency]}
  //             {(item.amount * convertRate).toFixed(2)}
  //           </Text>
  //           <Text>{formattedTime}</Text>
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   }}
  // />
}

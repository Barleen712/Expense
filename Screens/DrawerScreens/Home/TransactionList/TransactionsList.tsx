import React, { useContext, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, SectionList } from "react-native";
import { getStyles } from "./styles";
import { categoryMap, currencies } from "../../../Constants";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { RootState } from "../../../../Store/Store";

interface TransactionListProps {
  data: Array<{
    key: string;
    category: string;
    description: string;
    moneyCategory: "Income" | "Expense" | "Transfer";
    amount: number;
    wallet: string;
    Date: string;
  }>;
}

const pageSize = 2;

export default function TransactionList({ data }: Readonly<TransactionListProps>) {
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);

  const navigateFunc = ({ item }) => {
    if (item.moneyCategory === "Income") navigation.navigate("DetailTransaction_Income", { value: item });
    else if (item.moneyCategory === "Expense") navigation.navigate("DetailTransaction_Expense", { value: item });
    else navigation.navigate("DetailTransaction_Transfer", { value: item });
  };

  const isToday = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate.toDateString() === today.toDateString();
  };

  const isYesterday = (date: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = new Date(date);
    return targetDate.toDateString() === yesterday.toDateString();
  };

  const formatDate = (date: string) => {
    if (isToday(date)) return "Today";
    else if (isYesterday(date)) return "Yesterday";
    else return format(new Date(date), "MMM dd, yyyy");
  };

  const groupedData = useMemo(() => {
    return data.reduce((acc, item) => {
      const formattedDate = formatDate(item.Date);
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(item);
      return acc;
    }, {} as Record<string, typeof data>);
  }, [data]);

  const sections = useMemo(() => {
    return Object.keys(groupedData).map((date) => ({
      title: date,
      data: groupedData[date],
    }));
  }, [groupedData]);

  const paginatedSections = useMemo(() => {
    return sections.slice(0, page * pageSize);
  }, [sections, page]);

  const handleEndReached = () => {
    if (page * pageSize < sections.length) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.Date);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${meridiem}`;
    const key = item.moneyCategory === "Transfer" ? item.moneyCategory : item.category;
    const CategoryIcon = categoryMap[key];
    let amountColor = "";

    if (item.moneyCategory === "Income") {
      amountColor = "rgba(0, 203, 179, 1)";
    } else if (item.moneyCategory === "Expense") {
      amountColor = "rgba(253, 60, 74, 1)";
    } else {
      amountColor = "rgba(0, 119, 255, 1)";
    }
    return (
      <TouchableOpacity
        onPress={() => navigateFunc({ item })}
        style={{
          backgroundColor: colors.listView,
          height: 80,
          width: "97%",
          margin: 4,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ margin: 10 }}>{CategoryIcon && <CategoryIcon width={60} height={60} />}</View>
        <View style={{ width: "40%", justifyContent: "space-between", height: "70%" }}>
          <Text style={styles.balance} numberOfLines={1}>
            {t(item.category)}
          </Text>
          <Text style={[styles.categoryText, { color: "rgba(145, 145, 159, 1)" }]} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "35%", paddingRight: 10 }}>
          <Text style={[styles.categoryText, { color: amountColor }]}>
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
      sections={paginatedSections}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={1}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <View>
          <Text style={{ color: colors.color, fontFamily: "Inter", fontSize: 18, fontWeight: 600 }}>
            {t(section.title)}
          </Text>
        </View>
      )}
    />
  );
}

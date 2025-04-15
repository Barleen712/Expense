import React from "react";
import { View, Text, Dimensions } from "react-native";
import styles from "../../../Stylesheet";
import { ProgressBar, MD3Colors } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";
interface Report {
  type: string;
  amount: string;
  detail: string;
  category: string;
  amount1: string;
  bg: string;
  progress: number;
}
const width = Dimensions.get("window").width;
export default function FaceCard({ type, amount, detail, category, amount1, bg, progress }: Report) {
  const { t } = useTranslation();
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.cardMonth}>
        <ProgressBar
          progress={progress}
          color="white"
          style={{
            backgroundColor: "rgba(214, 224, 220, 0.24)",
            width: width - 20,
            margin: 10,
          }}
        />
        <Text style={styles.MonthText}>{t("This Month")}</Text>
      </View>
      <View style={styles.typeView}>
        <Text style={styles.typeText}>{t(type)}</Text>
        <Text style={styles.amountText}>{amount}</Text>
      </View>

      <View style={styles.detailView}>
        <View style={styles.detailbox}>
          <Text style={styles.detailText}>{t(detail)} </Text>
          <Text style={styles.category}>{category}</Text>
          <Text style={[styles.typeText, { color: "black" }]}>{amount1}</Text>
        </View>
      </View>
    </View>
  );
}

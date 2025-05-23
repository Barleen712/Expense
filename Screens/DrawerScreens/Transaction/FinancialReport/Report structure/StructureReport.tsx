import React, { useContext } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { getStyles } from "./styles";
import { ProgressBar, MD3Colors } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StringConstants, categoryMap, currencies } from "../../../../Constants";
import { ThemeContext } from "../../../../../Context/ThemeContext";
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
  const Rates = useSelector((state) => state.Rates);
  const currency = useSelector((state) => state.Money.preferences.currency);
  let convertRate;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  const Category = categoryMap[category === "Transfer" ? "Transfer" : category];
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.cardMonth}>
        <ProgressBar
          progress={progress}
          color={colors.backgroundColor}
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
        <Text style={styles.amountText}>
          {" "}
          {currencies[currency]} {(amount * convertRate).toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailView}>
        <View style={styles.detailbox}>
          <Text style={styles.detailText}>{t(detail)} </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 0.3,
                padding: 10,
                margin: 15,
                // marginTop: 5,
                backgroundColor: "rgba(189, 194, 194, 0.17)",
                borderRadius: 20,
              }}
            >
              <Category height={40} width={40} />
              <Text
                style={{
                  paddingLeft: 5,
                  flexShrink: 1,
                  fontFamily: "Inter",
                  fontWeight: "bold",
                  fontSize: 18,
                  color: colors.color,
                }}
              >
                {t(category)}
              </Text>
            </View>
            <Text style={[styles.typeText, { color: colors.color }]}>
              {currencies[currency]} {(amount1 * convertRate).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

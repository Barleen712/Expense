import React, { useContext } from "react";
import { LineChart } from "react-native-gifted-charts";
import { Platform, View, Text, Dimensions } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import styles from "../../../Stylesheet";
import { useSelector } from "react-redux";
import { currencies } from "../../../Constants";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../Store/Store";
interface Donut {
  data: Array<object>;
  value: number;
  radius?: number;
  strokeWidth?: number;
}
export const DonutChart = ({
  data,
  value,
  radius = Platform.OS === "ios" ? 80 : 90,
  strokeWidth = Platform.OS === "ios" ? 20 : 25,
}: Donut) => {
  const circumference = 2 * Math.PI * radius;
  let previousPercentage = 0;
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text style={[styles.typeText, { position: "absolute", top: "42%", color: colors.color, fontSize: 24 }]}>
        {currencies[currency]}
        {(value * convertRate).toFixed(2)}
      </Text>
      <Svg
        width={2 * (radius + strokeWidth)}
        height={2 * (radius + strokeWidth)}
        viewBox={`0 0 ${2 * (radius + strokeWidth)} ${2 * (radius + strokeWidth)}`}
      >
        <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
          {/* Loop through data and draw each segment */}
          {data.map((item: any, index: number) => {
            const strokeDashoffset = circumference * (1 - item.percentage / 100);
            const strokeDasharray = circumference;
            const strokeRotation = (previousPercentage / 100) * 360;
            previousPercentage += item.percentage;
            return (
              <G key={item.color} rotation={strokeRotation} origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
                <Circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" // Rounded edges
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};
interface LineData {
  data: { value: number }[];
  height: number;
}

export const Linearchart = ({ data, height }: LineData) => {
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const renderPointerLabel = (items, secondaryItem, pointerIndex) => {
    if (!items || items.length === 0 || pointerIndex === -1) return null;
    const { value, date } = items[0];
    const data_date = new Date(date);
    let hours = data_date.getHours();
    const minutes = data_date.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    const lastitem = new Date(data[data.length - 1].date).toISOString() === new Date(date).toISOString();

    return (
      <View
        style={{
          marginTop: 15,
          //marginLeft: 10,
          marginLeft: lastitem ? -60 : 0,
          backgroundColor: "rgb(42, 124, 118)",
          paddingLeft: 2,
          // paddingRight: 10,
          marginBottom: 30,
          borderRadius: 4,
          width: 60,
        }}
        pointerEvents="auto"
      >
        <Text style={{ color: "white", fontSize: 10 }}>
          {currencies[currency]}
          {(value * convertRate).toFixed(2)}
        </Text>
        <Text style={{ color: "white", fontSize: 10 }}>
          {data_date.getDate()}/{data_date.getMonth() + 1}:{formattedTime}
        </Text>
      </View>
    );
  };
  if (data.length <= 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.budgetText}>{t("Not Enough Expenses")}</Text>
      </View>
    );
  }

  return (
    <LineChart
      data={data}
      width={Dimensions.get("window").width}
      adjustToWidth={true}
      disableScroll
      yAxisLabelWidth={0}
      height={height}
      startFillColor="rgb(61, 122, 95)"
      endFillColor="rgba(187, 220, 212, 0.87)"
      initialSpacing={0}
      endSpacing={70}
      color="rgb(42, 124, 118)"
      thickness={8}
      hideDataPoints
      animateOnDataChange={true}
      renderDataPointsAfterAnimationEnds={true}
      hideRules
      showVerticalLines={false}
      areaChart
      hideYAxisText
      hideAxesAndRules
      focusEnabled={true}
      onlyPositive={true}
      yAxisOffset={-200}
      // yAxisExtraHeight={40}
      curved
      curveType={1}
      pointerConfig={{
        pointerColor: "rgb(42, 144, 114)",
        pointerStripUptoDataPoint: true,
        // autoAdjustPointerLabelPosition: true,
        // stripOverPointer: true,
        radius: 8,
        pointerLabelComponent: renderPointerLabel,
      }}
    />
  );
};

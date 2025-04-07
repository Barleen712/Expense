import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { Platform, View, Text, Dimensions } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import styles from "../../../Stylesheet";
interface Donut {
  data: Array<object>;
  radius?: number;
  strokeWidth?: number;
}
export const DonutChart = ({ data, radius = Platform.OS === "ios" ? 70 : 80, strokeWidth = 20 }: Donut) => {
  const circumference = 2 * Math.PI * radius;
  let previousPercentage = 0;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={[styles.typeText, { position: "absolute", top: "40%", color: "black" }]}>$332</Text>
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
              <G key={index} rotation={strokeRotation} origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
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
interface lineData {
  data: { value: number }[];
}
export const Linearchart = ({ data }: lineData) => {
  return (
    <LineChart
      data={data}
      width={Dimensions.get("window").width}
      adjustToWidth={true}
      disableScroll
      yAxisLabelWidth={0}
      height={Dimensions.get("window").height * 0.2}
      startFillColor="rgb(78, 144, 114)" // Start gradient color
      endFillColor="white"
      initialSpacing={0}
      endSpacing={0}
      color="rgb(42, 124, 118)"
      thickness={8}
      hideDataPoints
      hideRules
      showVerticalLines={false}
      areaChart
      hideYAxisText
      hideAxesAndRules
      focusEnabled={false}
      curved
    />
  );
};

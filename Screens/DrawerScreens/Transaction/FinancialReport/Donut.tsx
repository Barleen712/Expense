import React from "react";
import { Platform, View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import styles from "../../../Stylesheet";
interface Donut {
  data: Array<object>;
  radius?: number;
  strokeWidth?: number;
}
const DonutChart = ({ data, radius = Platform.OS === "ios" ? 70 : 80, strokeWidth = 20 }: Donut) => {
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
export default DonutChart;

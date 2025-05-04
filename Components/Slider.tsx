import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import styles from "../Screens/Stylesheet";
import { ThemeContext } from "../Context/ThemeContext";

const { width } = Dimensions.get("window");
interface SliderInterface {
  value: number;
  setvalue: (a: number) => void;
}
export default function CustomSlider({ value, setvalue }: SliderInterface) {
  const thumbPosition = (value / 100) * (width - 60);
  const {colors}=useContext(ThemeContext)
  return (
    <View style={[styles.container1,{backgroundColor:colors.backgroundColor}]}>
      <View style={styles.sliderWrapper}>
        <View style={styles.trackBackground} />
        <View style={[styles.trackFill, { width: `${value}%` }]} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={value}
          onValueChange={(value) => setvalue(value)}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
        />
        <View style={[styles.customThumb, { left: thumbPosition - 12 }]}>
          <Text style={styles.thumbText}>{Math.round(value)}%</Text>
        </View>
      </View>
    </View>
  );
}

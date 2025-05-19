import React, { useContext } from "react";
import { View, Text, Dimensions } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import styles from "../Screens/Stylesheet";
import { ThemeContext } from "../Context/ThemeContext";

const { width } = Dimensions.get("window");
interface SliderInterface {
  value: number;
  setvalue: (a: number) => void;
}
export default function CustomSlider({ value, setvalue }: Readonly<SliderInterface>) {
  const { colors } = useContext(ThemeContext);
  return (
    <View style={[styles.container1, { backgroundColor: colors.backgroundColor }]}>
      <Slider
        value={value}
        onValueChange={(val: number | number[]) => {
          if (Array.isArray(val)) setvalue(val[0]);
          else setvalue(val);
        }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        trackStyle={styles.trackBackground}
        minimumTrackTintColor="#2A7C76"
        maximumTrackTintColor="#d3d3d3"
        renderThumbComponent={() => (
          <View style={styles.customThumb}>
            <Text style={styles.thumbText}>{Math.round(value)}%</Text>
          </View>
        )}
      />
    </View>
  );
}

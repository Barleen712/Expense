import React, { useState } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import styles from "./styles";
import Keypad from "../../../Components/Keypad";
import Pin from "../../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
type pinProp = StackNavigationProp<StackParamList, "Setpin">;

interface Props {
  navigation: pinProp;
}
export default function Setpin({ navigation }: Readonly<Props>) {
  const [pin, setpin] = useState("");
  function handlenext() {
    if (pin.length === 4) navigation.navigate("Setpin1", { FirstPin: pin });
  }
  const { t } = useTranslation();
  const handleClear = () => {
    setpin(pin.slice(0, pin.length - 1));
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <View style={styles.setup}>
        <Text style={styles.setuptext}>{t(StringConstants.LetssetupyouPin)}</Text>
      </View>
      <Pin pin={pin} />
      <View style={styles.keypad}>
        <Keypad
          onClear={handleClear}
          change={handlenext}
          onKeyPress={(num) => {
            if (pin.length < 4) {
              setpin((prev) => prev + num);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

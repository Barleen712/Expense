import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
import styles from "../Stylesheet";
type Homeprop = StackNavigationProp<StackParamList, "Home">;

interface Props {
  navigation: Homeprop;
}
export default function Onboarding({ navigation }: Props) {
  function handlePress() {
    navigation.navigate("Login");
  }
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <View style={style.image}>
        <Image source={require("../../assets/Group 2.png")} style={style.group2} />
        <Image source={require("../../assets/Group 1.png")} style={style.group1} />
        <Image source={require("../../assets/Coint.png")} style={style.coint} />
        <Image source={require("../../assets/Donut.png")} style={style.donut} />
      </View>
      <View style={style.getstarted}>
        <View style={style.title}>
          <Text style={style.save}>{t(StringConstants.SpendSmarter)}</Text>
        </View>
        <View style={style.button}>
          <LinearGradient colors={["#69AEA9", "#3F8782"]} style={style.gradient}>
            <TouchableOpacity onPress={() => navigation.replace("GetStarted")}>
              <Text style={style.start}>{t(StringConstants.GetStarted)}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={style.text}>
          <TouchableOpacity onPress={handlePress}>
            <Text>
              {t(StringConstants.Alreadyhaveanaccount)}
              <Text style={style.login}>{t(StringConstants.Login)}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  image: {
    flex: 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  group2: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  group1: {
    height: "90%",
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
  },
  coint: {
    position: "absolute",
    bottom: "72%",
    left: Platform.OS === "ios" ? "18%" : "15%",
    height: "15%",
    width: "20%",
  },
  donut: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? "64%" : "63%",
    height: "15%",
    width: "20%",
    right: Platform.OS === "ios" ? "18%" : "15%",
  },
  save: {
    fontFamily: "Inter",
    fontWeight: 700,
    color: "rgb(67, 136, 131)",
    fontSize: Platform.OS === "ios" ? 30 : 30,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  getstarted: {
    flex: 0.35,
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    color: "white",
    fontSize: 20,
  },
  gradient: {
    width: "80%",
    height: "65%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(14, 36, 34)",
    elevation: 20,
  },
  login: {
    color: "rgb(57, 112, 109)",
  },
  title: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
  button: {
    flex: 0.35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 0.25,
    alignItems: "center",
  },
});

import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { getStyles } from "./styles";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { RFValue } from "react-native-responsive-fontsize";
type Homeprop = StackNavigationProp<StackParamList, "Home">;

interface Props {
  navigation: Homeprop;
}
export default function Onboarding({ navigation }: Readonly<Props>) {
  function handlePress() {
    navigation.navigate("Login");
  }
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const style = getStyles(colors);
  return (
    <SafeAreaView style={style.container}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <View style={style.image}>
        <Image source={require("../../../assets/Group 1.png")} style={style.group1} />
        <Image source={require("../../../assets/Coint.png")} style={style.coint} />
        <Image source={require("../../../assets/Donut.png")} style={style.donut} />
      </View>
      <View style={style.getstarted}>
        <View style={style.title}>
          <Text style={style.save}>{t(StringConstants.SpendSmarter)}</Text>
        </View>
        <View style={style.button}>
          <TouchableOpacity style={style.gradient} onPress={() => navigation.replace("GetStarted")}>
            <LinearGradient
              colors={["#69AEA9", "#3F8782"]}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={style.start}>{t(StringConstants.GetStarted)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={style.text}>
          <TouchableOpacity onPress={handlePress}>
            <Text style={{ color: "rgba(68, 68, 68, 1)", fontWeight: 400, fontSize: RFValue(12) }}>
              {t(StringConstants.Alreadyhaveanaccount)}
              <Text style={style.login}> Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

import React, { useContext, useEffect } from "react";
import { Image, View, Text } from "react-native";
import { getStyles } from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
type AllSetProp = StackNavigationProp<StackParamList, "AllSet">;

interface Props {
  navigation: AllSetProp;
  route: any;
}
export default function Success({ navigation, route }: Readonly<Props>) {
  const { title } = route.params;
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("EnterPin");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <View style={styles.success}>
        <Image source={require("../../../assets/success.png")} />
        <Text style={styles.ForgotDes}>{t(title)}</Text>
      </View>
    </View>
  );
}

import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList, Image } from "react-native";
import Input from "../../Components/CustomTextInput";
import { CustomButton } from "../../Components/CustomButton";
import styles from "../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
type EmailSentProp = StackNavigationProp<StackParamList, "EmailSent">;

interface Props {
  navigation: EmailSentProp;
}
export default function EmailSent({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.emailImgView}>
        <Image style={styles.emailImg} source={require("../../assets/email.png")} />
      </View>
      <View style={styles.emailDes}>
        <Text style={styles.ForgotDes}>{t(StringConstants.Youremailisontheway)}</Text>
        <Text style={styles.emailDesText}>{t(StringConstants.Checkyouremail)}</Text>
        <View style={styles.backToLogin}>
          <CustomButton
            title={t(StringConstants.BacktoLogin)}
            bg="rgb(42, 124, 118)"
            color="white"
            press={() => navigation.popTo("Login")}
          />
        </View>
      </View>
    </View>
  );
}

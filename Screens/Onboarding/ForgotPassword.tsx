import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../Components/CustomTextInput";
import { CustomButton } from "../../Components/CustomButton";
import styles from "../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
import { StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
type ForgotPasswordProp = StackNavigationProp<StackParamList, "ForgotPassword">;

interface Props {
  navigation: ForgotPasswordProp;
}

export default function ForgotPass({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t(StringConstants.ForgotPassword)} press={() => navigation.goBack()} />
      <View style={styles.ForgotTitle}>
        <Text style={styles.ForgotDes}>
          {t(StringConstants.DontWorry)}
          {"\n"}
          {t(StringConstants.Enteryouremail)}
        </Text>
      </View>
      <View style={styles.email}>
        <Input title={t(StringConstants.Email)} color="rgb(56, 88, 85)" css={styles.textinput} />
        <CustomButton
          title={t(StringConstants.Continue)}
          bg="rgb(42, 124, 118)"
          color="white"
          press={() => navigation.navigate("EmailSent")}
        />
      </View>
    </View>
  );
}

import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../Components/CustomTextInput";
import { CustomButton } from "../../Components/CustomButton";
import styles from "../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
type ForgotPasswordProp = StackNavigationProp<StackParamList, "ForgotPassword">;

interface Props {
  navigation: ForgotPasswordProp;
}
export default function ForgotPass({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header title="Forgot Password" press={() => navigation.goBack()} />
      <View style={styles.ForgotTitle}>
        <Text style={styles.ForgotDes}>
          Don’t worry {"\n"}
          Enter your email and we’ll send you a link to reset your password.
        </Text>
      </View>
      <View style={styles.email}>
        <Input title="E-mail" color="rgb(56, 88, 85)" css={styles.textinput} />
        <CustomButton
          title="Continue"
          bg="rgb(42, 124, 118)"
          color="white"
          press={() => navigation.navigate("EmailSent")}
        />
      </View>
    </View>
  );
}

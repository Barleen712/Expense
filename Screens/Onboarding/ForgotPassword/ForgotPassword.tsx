import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../../Components/CustomTextInput";
import { CustomButton } from "../../../Components/CustomButton";
import { getStyles } from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./../../FirebaseConfig";
import { ThemeContext } from "../../../Context/ThemeContext";
type ForgotPasswordProp = StackNavigationProp<StackParamList, "ForgotPassword">;

interface Props {
  navigation: ForgotPasswordProp;
}

export default function ForgotPass({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    const emailRegex =
      /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      alert("Please Enter Valid Email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      alert(error);
    }
    navigation.navigate("EmailSent", { email: email });
  };
  const {colors}=useContext(ThemeContext)
  const styles=getStyles(colors)
  return (
    <View style={styles.container}>
      <Header title={t(StringConstants.ForgotPassword)} press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color} />
      <View style={styles.ForgotTitle}>
        <Text style={styles.ForgotDes}>
          {t(StringConstants.DontWorry)}
          {"\n"}
          {t(StringConstants.Enteryouremail)}
        </Text>
      </View>
      <View style={styles.email}>
        <Input
          title={t(StringConstants.Email)}
          color="rgb(56, 88, 85)"
          css={styles.textinput}
          name={email}
          onchange={setEmail}
        />
        <CustomButton
          title={t(StringConstants.Continue)}
          bg="rgb(42, 124, 118)"
          color="white"
          press={() => {
            handleReset();
          }}
        />
      </View>
    </View>
  );
}

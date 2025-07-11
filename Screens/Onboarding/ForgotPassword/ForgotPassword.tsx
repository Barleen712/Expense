import React, { useContext, useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import Input from "../../../Components/CustomTextInput";
import { CustomButton } from "../../../Components/CustomButton";
import { getStyles } from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { collection, getDocs, query, where } from "firebase/firestore";
type ForgotPasswordProp = StackNavigationProp<StackParamList, "ForgotPassword">;

interface Props {
  navigation: ForgotPasswordProp;
}

export default function ForgotPass({ navigation }: Readonly<Props>) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleReset = async () => {
    if (loading) return; // prevent multiple presses
    setLoading(true);

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      alert("Please enter your email address.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanedEmail)) {
      alert("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "Names"), where("email", "==", cleanedEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("No account found with this email.");
      } else {
        try {
          await sendPasswordResetEmail(auth, cleanedEmail);
          navigation.navigate("EmailSent", { email: cleanedEmail });
        } catch (error) {
          alert("Something went wrong. Try again.");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try later.");
    }

    setLoading(false);
  };

  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  if (loading) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center", paddingTop: 0 }]}>
        <ActivityIndicator size="large" color={"green"} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(StringConstants.ForgotPassword)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
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
          color="rgba(145, 145, 159, 1)"
          css={styles.textinput}
          name={email}
          onchange={setEmail}
        />
        <View style={styles.continue}>
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
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../Components/CustomTextInput";
import { CustomButton } from "../../Components/CustomButton";
import styles from "../Stylesheet";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
type EmailSentProp = StackNavigationProp<StackParamList, 'EmailSent'>;

interface Props {
  navigation: EmailSentProp;
}
export default function EmailSent({ navigation }:Props) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.emailImgView}>
          <Image
            style={styles.emailImg}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/email.png")}
          />
        </View>
        <View style={styles.emailDes}>
          <Text style={styles.ForgotDes}>Your email is on the way</Text>
          <Text style={styles.emailDesText}>
            Check your email test@test.com and follow the instructions to reset your password
          </Text>
          <View style={styles.backToLogin}>
            <CustomButton
              title="Back to Login"
              bg="rgb(42, 124, 118)"
              color="white"
              press={() => navigation.popTo("Login")}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

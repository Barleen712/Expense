import React, { useEffect } from "react";
import { Image, View, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
type AllSetProp = StackNavigationProp<StackParamList, "AllSet">;

interface Props {
  navigation: AllSetProp;
}
export default function Success({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainScreen");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.success}>
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/success.png")} />
        <Text style={styles.ForgotDes}>You are set!</Text>
      </View>
    </View>
  );
}

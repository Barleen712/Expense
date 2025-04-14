import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, BackHandler } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../Constants";

type SettingsProp = StackNavigationProp<StackParamList, "Settings">;

interface Props {
  navigation: SettingsProp;
}
export default function Settings({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t(StringConstants.Settings)} press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Currency")}>
          <Text style={styles.settingtitle}>{t(StringConstants.Currency)}</Text>
          <View style={styles.titleoption}>
            <Text style={styles.settingtext}>USD</Text>
          </View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Language")}>
          <Text style={styles.settingtitle}>{t(StringConstants.Language)}</Text>
          <View style={styles.titleoption}>
            <Text style={styles.settingtext}>English</Text>
          </View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Theme")}>
          <Text style={styles.settingtitle}>{t(StringConstants.Theme)}</Text>
          <View style={styles.titleoption}>
            <Text style={styles.settingtext}>Light</Text>
          </View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Security")}>
          <Text style={styles.settingtitle}>{t(StringConstants.Security)}</Text>
          <View style={styles.titleoption}>
            <Text style={styles.settingtext}>Pin</Text>
          </View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Notification")}>
          <Text style={styles.settingtitle}>{t(StringConstants.Notification)}</Text>
          <View style={styles.titleoption}></View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
      </View>
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingsOptions}>
          <Text style={styles.settingtitle}>{t(StringConstants.About)}</Text>
          <View style={styles.titleoption}></View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions}>
          <Text style={styles.settingtitle}>{t(StringConstants.Help)}</Text>
          <View style={styles.titleoption}></View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
      </View>
    </View>
  );
}

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, BackHandler } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";

type SettingsProp = StackNavigationProp<StackParamList, "Settings">;

interface Props {
  navigation: SettingsProp;
}
export default function Settings({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header title="Settings" press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingsOptions} onPress={() => navigation.navigate("Currency")}>
          <Text style={styles.settingtitle}>Currency</Text>
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
          <Text style={styles.settingtitle}>Language</Text>
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
          <Text style={styles.settingtitle}>Theme</Text>
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
          <Text style={styles.settingtitle}>Security</Text>
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
          <Text style={styles.settingtitle}>Notification</Text>
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
          <Text style={styles.settingtitle}>About</Text>
          <View style={styles.titleoption}></View>
          <Image
            style={styles.arrows}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
          />
        </TouchableOpacity>
        <View style={styles.Line}></View>
        <TouchableOpacity style={styles.settingsOptions}>
          <Text style={styles.settingtitle}>Help</Text>
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

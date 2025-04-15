import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
type ThemeProp = StackNavigationProp<StackParamList, "EmailSent">;

interface Props {
  navigation: ThemeProp;
}
export default function Theme({ navigation }: Props) {
  const currencies = ["Light", "Dark", "Using device theme"];
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title="Theme" press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => setSelectedTheme(item)} style={styles.items}>
              <Text style={styles.itemTitle}>{t(item)}</Text>
              {selectedTheme === item && (
                <View style={styles.itemSelected}>
                  <Ionicons name="checkmark-circle" size={20} color="green"></Ionicons>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.Line}></View>
          </View>
        )}
      />
    </View>
  );
}

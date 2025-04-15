import React, { useState, useTransition } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList } from "react-native";

import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import i18n from "../../../i18n/i18next";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../Constants";

type LanguageProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: LanguageProp;
}
export default function Language({ navigation }: Props) {
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  const { t } = useTranslation();
  const currencies = [
    { name: "Arabic", code: "AR", tc: "ar" },
    { name: "Chinese", code: "ZH", tc: "zh" },
    { name: "English", code: "EN", tc: "en" },
    { name: "Italian", code: "IT", tc: "it" },
    { name: "Spanish", code: "ES", tc: "es" },
    { name: "Hindi", code: "HI", tc: "hi" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  return (
    <View style={styles.container}>
      <Header title={t("Language")} press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                changeLanguage(item.tc);
                setSelectedLanguage(item.tc);
              }}
              style={styles.items}
            >
              <Text style={styles.itemTitle}>
                {item.name} ({item.code})
              </Text>
              {selectedLanguage === item.tc && (
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

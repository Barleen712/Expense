import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from "react-native";

import { getStyles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import Header from "../../../../../Components/Header";
import i18n from "../../../../../i18n/i18next";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { changeLanguages, updatePreferences } from "../../../../../Slice/IncomeSlice";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import { RootState } from "../../../../../Store/Store";
type LanguageProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: LanguageProp;
}
export default function Language({ navigation }: Readonly<Props>) {
  const changeLanguage = (language: string | undefined) => {
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

  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.Money.preferences.language);
  const index = currencies.findIndex((item) => item.name == language);
  const [selectedLanguage, setSelectedLanguage] = useState(currencies[index].tc);
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t("Language")}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line}></View>
      <FlatList
        bounces={false}
        style={styles.settings}
        data={currencies}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                changeLanguage(item.tc);
                setSelectedLanguage(item.tc);
                dispatch(updatePreferences("language", item.name));
                dispatch(changeLanguages(item.name));
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
    </SafeAreaView>
  );
}

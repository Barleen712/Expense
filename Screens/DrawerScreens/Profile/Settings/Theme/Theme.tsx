import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { getStyles } from "../Language/styles";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import Header from "../../../../../Components/Header";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme, updatePreferences } from "../../../../../Slice/IncomeSlice";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import { RootState } from "../../../../../Store/Store";
type ThemeProp = StackNavigationProp<StackParamList, "EmailSent">;

interface Props {
  navigation: ThemeProp;
}
export default function Theme({ navigation }: Readonly<Props>) {
  const theme = useSelector((state: RootState) => state.Money.preferences.theme);
  const dispatch = useDispatch();
  const currencies = ["Light", "Dark", "Using device theme"];
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header title="Theme" press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color} />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelectedTheme(item);
                dispatch(changeTheme(item));
                dispatch(updatePreferences("theme", item));
              }}
              style={styles.items}
            >
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

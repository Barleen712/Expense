import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { getStyles } from "./style";
import Header from "../../../../Components/Header";
import { StringConstants } from "../../../Constants";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { RootState } from "../../../../Store/Store";

type SettingsProp = StackNavigationProp<StackParamList, "Settings">;

interface Props {
  navigation: SettingsProp;
}

interface SettingItemType {
  key: string;
  label: string;
  value?: string;
  navigateTo?: keyof StackParamList;
}

export default function Settings({ navigation }: Readonly<Props>) {
  const { t } = useTranslation();
  const preferences = useSelector((state: RootState) => state.Money.preferences);

  const settingsList: SettingItemType[] = [
    {
      key: "currency",
      label: t(StringConstants.Currency),
      value: preferences.currency,
      navigateTo: "Currency",
    },
    {
      key: "language",
      label: t(StringConstants.Language),
      value: preferences.language,
      navigateTo: "Language",
    },
    {
      key: "theme",
      label: t(StringConstants.Theme),
      value: preferences.theme,
      navigateTo: "Theme",
    },
    {
      key: "security",
      label: t(StringConstants.Security),
      value: preferences.security,
      navigateTo: "Security",
    },
    {
      key: "notification",
      label: t(StringConstants.Notification),
      navigateTo: "Notification",
    },
    {
      key: "about",
      label: t(StringConstants.About),
      navigateTo: "AboutUs",
    },
    {
      key: "help",
      label: t(StringConstants.Help),
      navigateTo: "Help",
    },
  ];
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  const renderItem = ({ item }: { item: SettingItemType }) => (
    <View>
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          if (item.navigateTo) navigation.navigate(item.navigateTo);
        }}
      >
        <Text style={styles.settingtitle}>{item.label}</Text>
        <View style={styles.titleoption}>{item.value && <Text style={styles.settingtext}>{item.value}</Text>}</View>
        <Image style={styles.arrows} source={require("../../../../assets/arrow.png")} />
      </TouchableOpacity>
      <View style={styles.Line} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.Settings)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line} />
      <FlatList
        data={settingsList}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

import React from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import Input from "../../../Components/CustomTextInput";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
type ExportProp = StackNavigationProp<StackParamList, "Export">;

interface Props {
  navigation: ExportProp;
}
export default function Export({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t("Export Data")} press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <View style={styles.export}>
        <Text style={styles.exportText}>{t("What data do you want to export?")}</Text>
        <Input title="All" color="rgb(56, 88, 85)" css={styles.textinput1} isPass={false} />
        <Text style={styles.exportText}>{t("When date range?")}</Text>
        <Input title="Last 30 days" color="rgb(56, 88, 85)" css={styles.textinput1} isPass={false} />
        <Text style={styles.exportText}>{t("What format do you want to export?")}</Text>
        <Input title="Csv" color="rgb(56, 88, 85)" css={styles.textinput1} isPass={false} />
      </View>
      <View style={styles.exportButton}>
        <CustomButton
          title={t("Export")}
          bg="rgb(42, 124, 118)"
          color="white"
          press={() => navigation.navigate("Export1")}
        />
      </View>
    </View>
  );
}

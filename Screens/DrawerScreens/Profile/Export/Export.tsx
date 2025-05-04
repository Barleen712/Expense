import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { getStyles } from "./styles";
import { CustomButton } from "../../../../Components/CustomButton";
import Input from "../../../../Components/CustomTextInput";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import { useTranslation } from "react-i18next";
import CustomD from "../../../../Components/Practice";
import { GenerateCSVReport } from "./ExportCSV";
import { generateReportPDF } from "./ExportPDF";
import { ThemeContext } from "../../../../Context/ThemeContext";
type ExportProp = StackNavigationProp<StackParamList, "Export">;

interface Props {
  navigation: ExportProp;
}
const category = ["CSV", "PDF"];
export default function Export({ navigation }: Props) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("CSV");
  function exporting()
  {
    if(selectedCategory==="CSV")
    {
      GenerateCSVReport()
    }
    else{
      generateReportPDF()
    }
  }
  const {colors}=useContext(ThemeContext)
  const styles=getStyles(colors)
  return (
    <View style={styles.container}>
      <Header title={t("Export Data")} press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color} />
      <View style={styles.Line}></View>
      <View style={styles.export}>
        <Text style={styles.exportText}>{t("What data do you want to export?")}</Text>
        <Input title="All" color="rgb(56, 88, 85)" css={styles.textinput1} isPass={false} />
        <Text style={styles.exportText}>{t("When date range?")}</Text>
        <Input title="Last 30 days" color="rgb(56, 88, 85)" css={styles.textinput1} isPass={false} />
        <Text style={styles.exportText}>{t("What format do you want to export?")}</Text>
        <CustomD
          name={selectedCategory}
          data={category}
          styleButton={styles.textinput}
          styleItem={styles.dropdownItems}
          styleArrow={styles.arrowDown}
          onSelectItem={(item) => setSelectedCategory(item)}
        />
      </View>
      <View style={styles.exportButton}>
        <CustomButton title={t("Export")} bg="rgb(42, 124, 118)" color="white" press={exporting} />
      </View>
    </View>
  );
}

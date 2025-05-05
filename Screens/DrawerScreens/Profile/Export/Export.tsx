import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { getStyles } from "./styles";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import { useTranslation } from "react-i18next";
import { GenerateCSVReport } from "./ExportCSV";
import { generateReportPDF } from "./ExportPDF";
import { ThemeContext } from "../../../../Context/ThemeContext";
import DropdownComponent from "../../../../Components/DropDown";
type ExportProp = StackNavigationProp<StackParamList, "Export">;
interface Props {
  navigation: ExportProp;
}
const category = [
  { label: "CSV", value: "0" },
  { label: "PDF", value: "1" },
];
const data = [
  { label: "Income", value: "0" },
  { label: "Expense", value: "1" },
  { label: "Transfer", value: "2" },
  { label: "Budget", value: "3" },
  { label: "All", value: "4" },
];
const date = [
  { label: "Today", value: "0" },
  { label: "Last 7 days", value: "1" },
  { label: "Last 15 days", value: "2" },
  { label: "This Month", value: "3" },
];
export default function Export({ navigation }: Props) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(category[0].value);
  const [exportdata, selectedData] = useState(data[4].value);
  const [dateRange, selecteddateRange] = useState(date[3].value);
  async function exporting() {
    if (selectedCategory === "0") {
      await GenerateCSVReport(exportdata, dateRange);
    } else {
      generateReportPDF(exportdata, dateRange);
    }
  }
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title={t("Export Data")}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line}></View>
      <View style={styles.export}>
        <Text style={styles.exportText}>{t("What data do you want to export?")}</Text>
        <View style={{ alignItems: "center" }}>
          <DropdownComponent
            data={data}
            value={exportdata}
            name={exportdata}
            styleButton={styles.textinput}
            onSelectItem={(item) => {
              selectedData(item);
            }}
          />
        </View>
        <Text style={styles.exportText}>{t("When date range?")}</Text>
        <View style={{ alignItems: "center" }}>
          <DropdownComponent
            data={date}
            value={dateRange}
            styleButton={styles.textinput}
            name={dateRange}
            onSelectItem={(item) => {
              selecteddateRange(item);
            }}
          />
        </View>
        <Text style={styles.exportText}>{t("What format do you want to export?")}</Text>
        <View style={{ alignItems: "center" }}>
          <DropdownComponent
            data={category}
            value={selectedCategory}
            name={selectedCategory}
            styleButton={styles.textinput}
            onSelectItem={(item) => {
              setSelectedCategory(item);
            }}
          />
        </View>
      </View>
      <View style={styles.exportButton}>
        <CustomButton title={t("Export")} bg="rgb(42, 124, 118)" color="white" press={exporting} />
      </View>
    </View>
  );
}

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import { getStyles } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { categoryMap, currencies, CATEGORY_COLORS, StringConstants } from "../../../Constants";
import { ProgressBar } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CustomButton } from "../../../../Components/CustomButton";
import CustomModal from "../../../../Components/Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { deleteBudget } from "../../../../Slice/IncomeSlice";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { markPendingDeleteOrDeleteBudget } from "../../../../Realm/Budgetrealm";
import { RootState } from "../../../../Store/Store";
type DetailedBudget = StackNavigationProp<StackParamList, "DetailBudget">;

interface Props {
  navigation: DetailedBudget;
  route: any;
}
const width = Dimensions.get("window").width - 60;
export default function DetailedBudget({ navigation, route }: Readonly<Props>) {
  const { category, remaining, progress, exceeded, index, total, percentage, alert, year, Month } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  async function deleteBudgetFunction() {
    markPendingDeleteOrDeleteBudget(index);
    dispatch(deleteBudget(index));
  }
  const { t } = useTranslation();
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);

  type CategoryKey = keyof typeof categoryMap;
  const categoryKey = (category === "Transfer" ? "Transfer" : category) as CategoryKey;
  const Category = categoryMap[categoryKey];

  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.DetailBudget)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <TouchableOpacity style={styles.Trash} onPress={() => setModalVisible(true)}>
        <CustomModal
          visible={modalVisible}
          setVisible={() => setModalVisible(!modalVisible)}
          color={colors.nobutton}
          bg={CATEGORY_COLORS[category]}
          head={t("Remove this budget")}
          text={t("Are you sure you want to remove this budget?")}
          onsuccess={t("Budget has been successfully removed")}
          navigation={navigation}
          deleteT={deleteBudgetFunction}
        />
        <Ionicons name="trash" size={26} color={colors.color} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginBottom: 30, alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.3,
              padding: 10,
              margin: 15,
              backgroundColor: "rgba(254, 255, 255, 0.85)",
              borderRadius: 20,
            }}
          >
            <Category width={40} height={40} />
            <Text
              style={{
                paddingLeft: 5,
                flexShrink: 1,
                fontFamily: "Inter",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {t(category)}
            </Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={styles.typeText}>{t("Remaining")}</Text>
            <Text style={styles.amountText}>
              {currencies[currency]}
              {(remaining * convertRate).toFixed(2)}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color={CATEGORY_COLORS[category]}
            fillStyle={{
              borderRadius: 20,
            }}
            style={{
              backgroundColor: "rgba(214, 224, 220, 0.24)",
              width: width,
              height: 15,
              borderRadius: 20,
              marginTop: 5,
            }}
          />
          {exceeded && (
            <View style={styles.limitexceed}>
              <AntDesign name="exclamationcircle" size={24} color="white" />
              <Text style={[styles.categoryText, { color: "white" }]}>{t("You've exceeded the limit")}</Text>
            </View>
          )}
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <CustomButton
            title={t("Edit")}
            bg={CATEGORY_COLORS[category]}
            color="white"
            press={() =>
              navigation.navigate("CreateBudget", {
                value: total,
                category: category,
                alert: alert,
                percentage: percentage,
                index: index,
                edit: true,
                year: year,
                month: Month,
                header: "Edit Budget",
              })
            }
          />
        </View>
      </View>
    </View>
  );
}

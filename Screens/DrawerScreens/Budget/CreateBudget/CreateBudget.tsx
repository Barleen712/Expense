import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getStyles } from "./styles";
import { CustomButton } from "../../../../Components/CustomButton";
import DropdownComponent from "../../../../Components/DropDown";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import CustomSlider from "../../../../Components/Slider";
import { addBudget, updateBudget } from "../../../../Slice/IncomeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { StringConstants, currencies } from "../../../Constants";
import { auth } from "../../../FirebaseConfig";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { BudgetCategory } from "../../../../Slice/Selectors";
import { ScrollView } from "react-native-gesture-handler";
import { getRealm } from "../../../../Realm/realm";
import { syncUnsyncedBudget } from "../../../../Realm/SyncBudget";
import NetInfo from "@react-native-community/netinfo";
import { updateTransactionRealmAndFirestoreBudget } from "../../../../Realm/Budgetrealm";
import { RootState } from "../../../../Store/Store";
type CreateBudgetProp = StackNavigationProp<StackParamList, "CreateBudget">;

interface Props {
  navigation: CreateBudgetProp;
  route: any;
}
const category = [
  { label: "Shopping", value: "Shopping" },
  { label: "Food", value: "Food" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Subscription", value: "Subscription" },
  { label: "Transportation", value: "Transportation" },
  { label: "Bills", value: "Bills" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];

export default function CreateBudget({ navigation, route }: Readonly<Props>) {
  const Budgetcat = useSelector(BudgetCategory);
  const parameters = route.params;
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [Expense, setExpense] = useState(parameters.alert);
  const [sliderValue, setSliderValue] = useState(parameters.percentage);
  const [Budget, setBudget] = useState<string>(`${parameters.value}`);
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const Rates = useSelector((state: RootState) => state.Rates);
  let convertRate: number;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  const handleFocus = () => {
    if (Budget === "0") {
      setBudget("");
    }
  };
  const handleIncomeChange = (text: string) => {
    setAmountError("");
    const formattedText = text.replace(/[^0-9.]/g, "");
    const regex = /^(\d{0,5})(\.\d{0,2})?$/;

    if (regex.test(formattedText)) {
      setBudget(formattedText);
    } else {
      setAmountError("Maximum budget allowed $99,999.99");
    }
  };
  const dispatch = useDispatch();
  const user = auth.currentUser;
  async function add() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0") / convertRate;
    if (numericBudget === 0) {
      setAmountError("Please enter a valid amount");
      return;
    }
    if (selectedCategory === "Category") {
      setCategoryError("Please select a category");
      return;
    }
    const selectedMonthKey = `${parameters.year}-${String(parameters.month + 1).padStart(2, "0")}`;
    const budgetDataForMonth = Budgetcat[selectedMonthKey] || [];
    const findCategory = budgetDataForMonth.find((item) => item.category === selectedCategory) || null;
    if (findCategory) {
      Alert.alert("Budget Exists", `Budget already exists for ${selectedCategory} for this month`);
      setBudget("0");
      setSelectedCategory("");
      setExpense(false);
      setSliderValue(20);
      return;
    }
    const realm = await getRealm();
    const BudgetData = {
      category: selectedCategory,
      amount: numericBudget,
      month: parameters.month,
      percentage: Math.round(sliderValue),
      notification: Expense,
      notified: false,
      year: parameters.year,
      _id: new Date().toISOString(),
      synced: false,
    };

    try {
      if (realm) {
        realm.write(() => {
          realm.create("Budget", BudgetData);
          dispatch(addBudget(BudgetData));
        });
      } else {
        console.log("Realm instance is undefined");
      }
    } catch (error) {
      console.log(error, "1234");
    }
    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      syncUnsyncedBudget();
    }
    navigation.goBack();
  }
  async function editBudget() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0") / convertRate;

    const realm = await getRealm();
    const updatedData = {
      category: selectedCategory,
      percentage: sliderValue,
      amount: numericBudget,
      id: parameters.index,
      notification: Expense,
      notified: false,
    };
    const { isConnected } = await NetInfo.fetch();
    updateTransactionRealmAndFirestoreBudget(parameters.index ?? "", updatedData, isConnected);
    dispatch(
      updateBudget({
        category: selectedCategory,
        percentage: sliderValue,
        amount: numericBudget,
        id: parameters.index,
        notification: Expense,
        notified: false,
      })
    );
    navigation.goBack();
    navigation.goBack();
  }
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header title={t(parameters.header)} press={() => navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.add}>
            <View style={styles.balanceView}>
              <Text style={styles.balance}>{t("How much do you want to spend?")}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.amount}>{currencies[currency]}</Text>
                <TouchableOpacity activeOpacity={1} style={{ width: "90%" }}>
                  <TextInput
                    value={Budget}
                    keyboardType="numeric"
                    onChangeText={handleIncomeChange}
                    style={styles.amount}
                    onFocus={handleFocus}
                  />
                </TouchableOpacity>
              </View>
              {amountError !== "" && (
                <Text
                  style={{
                    color: "rgb(255, 0, 17)",
                    marginTop: 4,
                    marginLeft: 10,
                    fontFamily: "Inter",
                  }}
                >
                  *{amountError}
                </Text>
              )}
            </View>
            <View style={styles.selection}>
              <DropdownComponent
                data={category}
                value={selectedCategory}
                name={t(parameters.category)}
                styleButton={styles.textinput}
                onSelectItem={(item) => {
                  setSelectedCategory(item);
                  setCategoryError("");
                }}
                position="bottom"
                height={150}
              />
              {categoryError !== "" && (
                <Text
                  style={{
                    color: "rgb(255, 0, 17)",
                    marginTop: 4,
                    marginLeft: 10,
                    fontFamily: "Inter",
                    width: "90%",
                  }}
                >
                  *{categoryError}
                </Text>
              )}
              <View style={styles.dropdown}>
                <View style={styles.notiView}>
                  <View style={styles.noti}>
                    <Text style={styles.notiTitle}>{t(StringConstants.RecieveAlert)}</Text>
                    <Text style={styles.notiDes}>{t(StringConstants.Receivealertwhenitreachessomepoint)}</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
                      value={Expense}
                      thumbColor={"white"}
                      onValueChange={setExpense}
                    />
                  </View>
                </View>
                {Expense && <CustomSlider value={sliderValue} setvalue={setSliderValue} />}
                <CustomButton
                  title={t(StringConstants.Continue)}
                  bg="rgb(42, 124, 118)"
                  color="white"
                  press={parameters.edit ? editBudget : add}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

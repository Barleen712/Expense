import React, { useContext, useState } from "react";
import { View, Text, Switch, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { getStyles } from "./styles";
import { CustomButton } from "../../../../Components/CustomButton";
import DropdownComponent from "../../../../Components/DropDown";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import CustomSlider from "../../../../Components/Slider";
import { updateBudget } from "../../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";
import { AddBudget } from "../../../FirestoreHandler";
import { auth } from "../../../FirebaseConfig";
import { updateBudgetDocument } from "../../../FirestoreHandler";
import { ThemeContext } from "../../../../Context/ThemeContext";
import { useSelector } from "react-redux";
import { BudgetCategory } from "../../../../Slice/Selectors";
type CreateBudgetProp = StackNavigationProp<StackParamList, "CreateBudget">;

interface Props {
  navigation: CreateBudgetProp;
  route: {
    params: {
      value: number;
      percentage: number;
      alert: boolean;
      edit: boolean;
      category: string;
      index?: string;
      header: string;
    };
  };
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

export default function CreateBudget({ navigation, route }: Props) {
  const Budgetcat = useSelector(BudgetCategory);
  const parameters = route.params;
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [Expense, setExpense] = useState(parameters.alert);
  const [sliderValue, setSliderValue] = useState(parameters.percentage);
  const [Budget, setBudget] = useState<string>(`${parameters.value}`);
  const [missing, setmissing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
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
  function add() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0");
    if (numericBudget === 0) {
      setAmountError("Please enter a valid amount");
      return;
    }
    if (selectedCategory === "Category") {
      setCategoryError("Please select a category");
      return;
    }
    const selectedMonthKey = `${parameters.year}-${String(parameters.month + 1).padStart(2, "0")}`;
    const budgetDataForMonth = Budgetcat[parameters.month] || [];
    const findCategory = budgetDataForMonth.find((item) => item.category === selectedCategory) || null;
    if (findCategory) {
      Alert.alert("Budget Exists", `Budget already exists for ${selectedCategory} for this month`);
      setBudget("");
      setSelectedCategory("");
      setExpense(false);
      setSliderValue(20);
      return;
    }
    // dispatch(
    //   addBudget({
    //     category: selectedCategory,
    //     amount: numericBudget,
    //     percentage: Math.round(sliderValue),
    //     notification: Expense,
    //   })
    // );
    AddBudget({
      category: selectedCategory,
      amount: numericBudget,
      month: parameters.month,
      percentage: Math.round(sliderValue),
      notification: Expense,
      userId: user.uid,
      notified: false,
      year: parameters.year,
    });
    navigation.goBack();
  }
  function editBudget() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0");
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
    updateBudgetDocument("Budgets", parameters.index, {
      category: selectedCategory,
      percentage: sliderValue,
      amount: numericBudget,
      noti: Expense,
      notified: false,
    });
    navigation.goBack();
    navigation.goBack();
  }
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header title={t(parameters.header)} press={() => navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.add}>
          <View style={styles.balanceView}>
            <Text style={styles.balance}>{t("How much do you want to spend?")}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.amount}>$</Text>

              <TextInput
                value={Budget}
                keyboardType="numeric"
                onChangeText={handleIncomeChange}
                style={styles.amount}
                onFocus={handleFocus}
              />
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
      </TouchableWithoutFeedback>
    </View>
  );
}

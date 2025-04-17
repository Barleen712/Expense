import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import CustomD from "../../../Components/Practice";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import CustomSlider from "../../../Components/Slider";
import { addBudget, updateBudget } from "../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../Constants";
import { AddBudget } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
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
      index?: number;
      header: string;
    };
  };
}
const category = ["Shopping", "Food", "Entertainment", "Subscription", "Transportation", "Bills", "Miscellaneous"];

export default function CreateBudget({ navigation, route }: Props) {
  const parameters = route.params;
  const [Expense, setExpense] = useState(parameters.alert);
  const [sliderValue, setSliderValue] = useState(parameters.percentage);
  const [Budget, setBudget] = useState<string>(`$${parameters.value}`);
  const [missing, setmissing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
  const handleFocus = () => {
    if (missing === true) {
      setmissing(false);
    } else if (Budget === "" || Budget === "$0" || Budget === "$") {
      setBudget("$");
    }
  };

  const handleIncomeChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    setBudget(`$${numericValue}`);
  };
  const dispatch = useDispatch();
  const user = auth.currentUser;
  function add() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0");
    if (selectedCategory === "Category" || numericBudget === 0) {
      setmissing(true);
      return;
    }
    dispatch(
      addBudget({
        category: selectedCategory,
        amount: numericBudget,
        percentage: Math.round(sliderValue),
        notification: Expense,
      })
    );
    AddBudget({
      category: selectedCategory,
      amount: numericBudget,
      percentage: Math.round(sliderValue),
      notification: Expense,
      userId: user.uid,
      Date: new Date().toISOString(),
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
        index: parameters.index,
      })
    );
    navigation.goBack();
    navigation.goBack();
  }
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t(parameters.header)} press={() => navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.add}>
          <View style={styles.balanceView}>
            <Text style={styles.balance}>{t("How much do you want to spend?")}</Text>
            <TextInput
              value={Budget}
              keyboardType="numeric"
              onChangeText={handleIncomeChange}
              style={styles.amount}
              onFocus={handleFocus}
            />
          </View>
          <View style={styles.selection}>
            <CustomD
              name={t(parameters.category)}
              data={category}
              styleButton={styles.textinput}
              styleItem={styles.dropdownItems}
              styleArrow={styles.arrowDown}
              onSelectItem={(item) => setSelectedCategory(item)}
            />
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
            {missing && (
              <View style={{ position: "absolute", top: "2%", left: "7%" }}>
                <Text style={{ color: "red", fontStyle: "bold" }}>*Specify Category and Budget Amount</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

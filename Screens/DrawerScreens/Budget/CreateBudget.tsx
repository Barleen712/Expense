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
import { addBudget } from "../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
type CreateBudgetProp = StackNavigationProp<StackParamList, "CreateBudget">;

interface Props {
  navigation: CreateBudgetProp;
}
const category = ["Shopping", "Food", "Entertainment", "Subscription", "Transportation", "Bills", "Miscellaneous"];

export default function CreateBudget({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Budget, setBudget] = useState<string>("$0");
  const [sliderValue, setSliderValue] = useState(20);
  const handleFocus = () => {
    if (Budget === "" || Budget === "$0" || Budget === "$") {
      setBudget("$");
    }
  };
  const handleIncomeChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    setBudget(`$${numericValue}`);
  };
  const dispatch = useDispatch();
  function add() {
    const numericBudget = parseFloat(Budget.replace("$", "") || "0");
    dispatch(addBudget({ category: selectedCategory, amount: numericBudget, percentage: Math.round(sliderValue) }));
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <Header title="Create Budget" press={() => navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.add}>
          <View style={styles.balanceView}>
            <Text style={styles.balance}>How much do you want to spend ?</Text>
            <TouchableOpacity activeOpacity={1}>
              <TextInput
                value={Budget}
                keyboardType="numeric"
                onChangeText={handleIncomeChange}
                style={styles.amount}
                onFocus={handleFocus}
              ></TextInput>
            </TouchableOpacity>
          </View>
          <View style={styles.selection}>
            <CustomD
              name="Category"
              data={category}
              styleButton={styles.textinput}
              styleItem={styles.dropdownItems}
              styleArrow={styles.arrowDown}
              onSelectItem={(item) => setSelectedCategory(item)}
            />
            <View style={styles.dropdown}>
              <View style={styles.notiView}>
                <View style={styles.noti}>
                  <Text style={styles.notiTitle}>Receive Alert</Text>
                  <Text style={styles.notiDes}>Receive alert when it reaches some point</Text>
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
              <CustomButton title="Continue" bg="rgb(42, 124, 118)" color="white" press={add} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

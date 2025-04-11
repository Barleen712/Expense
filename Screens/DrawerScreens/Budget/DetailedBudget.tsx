import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { categoryMap } from "../../Constants";
import { ProgressBar } from "react-native-paper";
import { CATEGORY_COLORS } from "../../Constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CustomButton } from "../../../Components/CustomButton";
import CustomModal from "./Modal";
import { useSelector, useDispatch } from "react-redux";
import { deleteBudget } from "../../../Slice/IncomeSlice";
type DetailedBudget = StackNavigationProp<StackParamList, "DetailBudget">;

interface Props {
  navigation: DetailedBudget;
  route: {
    params: {
      category: string;
      remaining: number;
      progress: number;
      exceeded: boolean;
      index: number;
      total: number;
      percentage: number;
    };
  };
}
const width = Dimensions.get("window").width - 60;
export default function DetailedBudget({ navigation, route }: Props) {
  const { category, remaining, progress, exceeded, index, total, percentage } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  function deleteBudgetFunction() {
    dispatch(deleteBudget(index));
  }
  return (
    <View style={styles.container}>
      <Header title="Detail Budget" press={() => navigation.goBack()} />
      <TouchableOpacity style={styles.Trash} onPress={() => setModalVisible(true)}>
        <CustomModal
          visible={modalVisible}
          setVisible={() => setModalVisible(!modalVisible)}
          color="rgba(237, 234, 234, 0.28)"
          bg={CATEGORY_COLORS[category]}
          head="Remove this budget"
          text="Are you sure you want to remove this budget?"
          onsuccess="Budget has been removed successfully"
          navigation={navigation}
          deleteT={deleteBudgetFunction}
        />
        <Ionicons name="trash" size={26} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, marginBottom: 30, alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              width: "35%",
              backgroundColor: "white",
              height: 64,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: "grey",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Image style={{ width: 30, height: 30 }} source={categoryMap[category]} />
            <Text style={styles.category}>{category}</Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={[styles.typeText, { color: "black" }]}>Remaining</Text>
            <Text style={[styles.amountText, { marginVertical: 0, color: "black" }]}>${remaining}</Text>
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
              <Text style={[styles.categoryText, { color: "white" }]}>You've exceeded the limit</Text>
            </View>
          )}
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <CustomButton
            title="Edit"
            bg={CATEGORY_COLORS[category]}
            color="white"
            press={() =>
              navigation.navigate("CreateBudget", {
                value: total,
                category: category,
                alert: true,
                percentage: percentage,
                index: index,
                edit: true,
                header: "Edit Budget",
              })
            }
          />
        </View>
      </View>
    </View>
  );
}

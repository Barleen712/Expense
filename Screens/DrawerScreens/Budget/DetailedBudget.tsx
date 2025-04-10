import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { categoryMap } from "../../Constants";
import { ProgressBar } from "react-native-paper";
import { CATEGORY_COLORS } from "../../Constants";
type DetailedBudget = StackNavigationProp<StackParamList, "DetailBudget">;

interface Props {
  navigation: DetailedBudget;
}
const width = Dimensions.get("window").width - 60;
export default function DetailedBudget({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header title="Detail Budget" press={() => navigation.goBack()} />
      <TouchableOpacity style={styles.Trash}>
        <Ionicons name="trash" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, marginBottom: 30 }}>
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
              justifyContent: "space-evenly",
            }}
          >
            <Image style={{ width: 40, height: 40 }} source={categoryMap["Food"]} />
            <Text style={styles.category}>Shopping</Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={[styles.typeText, { color: "black" }]}>Remaining</Text>
            <Text style={[styles.amountText, { marginVertical: 0, color: "black" }]}>$0</Text>
          </View>
          <ProgressBar
            progress={1}
            color={CATEGORY_COLORS["Shopping"]}
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
        </View>
      </View>
    </View>
  );
}

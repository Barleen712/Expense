import React, { useContext } from "react";
import Carousel from "react-native-reanimated-carousel";
import { View, Text, Platform, StatusBar, Dimensions, Image } from "react-native";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import Header from "../../../../../Components/Header";

export default function Tutorial({ navigation }) {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const width = Dimensions.get("screen").width * 0.9;
  const height = Dimensions.get("screen").height * 0.7;

  const carouselData = [
    {
      id: "1",
      title: "Track Expenses Easily",
      image: require("../../../../../assets/Track.png"),
      des: "Log daily expenses, incomes and transfers effortlessly",
    },
    {
      id: "2",
      title: "Set Budgets",
      image: require("../../../../../assets/SetBudget.png"),
      des: "Create monthly budgets for categories like Food, Travel, and more.",
    },
    {
      id: "3",
      title: "Visualize Your Spending",
      image: require("../../../../../assets/Grpah.png"),
      des: "See where your money goes with beautiful charts.",
    },
    {
      id: "4",
      title: "Track Your Progress",
      image: require("../../../../../assets/Grpah2.png"),
      des: "Keep an eye on your monthly trends and comparisons.",
    },
    {
      id: "5",
      title: "Get Smart Alerts",
      image: require("../../../../../assets/getAlert.png"),
      des: "Stay informed with spending alerts and savings tips.",
    },
  ];

  const renderItem = ({ item }) => (
    <View
      style={{
        width,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        padding: 10,
        backgroundColor: `${colors.color}26`, // Hex with 15% opacity
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: colors.color,
          marginBottom: 10,
        }}
      >
        {item.title}
      </Text>
      <Image
        style={{
          height: height * 0.98,
          width: width * 0.8,
          resizeMode: "stretch",
        }}
        source={item.image}
      />
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontWeight: "500",
          width: "90%",
          marginTop: 15,
          color: colors.color,
        }}
      >
        {item.des}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.backgroundColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <Header
        title="Get Started"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <Carousel
        data={carouselData}
        renderItem={renderItem}
        width={width}
        loop
        autoPlay
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      />
    </View>
  );
}

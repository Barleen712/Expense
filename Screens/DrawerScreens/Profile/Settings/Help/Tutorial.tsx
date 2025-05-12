import React, { useContext, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { View, Text, Platform, StatusBar, Dimensions, Image, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../../../../Context/ThemeContext";
import Header from "../../../../../Components/Header";

export default function Tutorial({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const width = Dimensions.get("screen").width * 0.9;
  const height = Dimensions.get("screen").height * 0.7;

  const carousel_data = [
    {
      id: "1",
      title: "Track Expenses Easily",
      image: require("../../../../../assets/Track.png"),
      des: "Log daily expenses , incomes and transfers effortlessly",
    },
    {
      id: "2",
      image: require("../../../../../assets/SetBudget.png"),
      title: "Set Budgets",
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
      image: require("../../../../../assets/getAlert.png"),
      title: "Get Smart Alerts",
      des: "Stay informed with spending alerts and savings tips.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const render = ({ item }) => {
    return (
      <View
        style={{
          width: width,
          //margin: 10,
          //  marginLeft: 10,
          //  marginRight: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          padding: 10,
          backgroundColor: "rgba(54, 85, 39, 0.16)",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "rgb(54, 85, 39)", marginBottom: 10 }}>
          {item.title}
        </Text>
        <Image style={{ height: height * 0.98, width: width * 0.8, resizeMode: "stretch" }} source={item.image} />
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            fontWeight: "500",
            width: "90%",
            //  color: colors.color,
            marginTop: 15,
            color: "rgb(54, 85, 39)",
          }}
        >
          {item.des}
        </Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < carousel_data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigation.goBack(); // or navigate to home screen
    }
  };

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
        data={carousel_data}
        renderItem={render}
        width={width}
        // height={height}
        loop={true}
        autoPlay={true}
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        onSnapToItem={(index) => setCurrentIndex(index)}
      />

      {/* Dots */}
      {/* <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
        {carousel_data.map((_, i) => (
          <View
            key={i}
            style={{
              height: 8,
              width: currentIndex === i ? 24 : 8,
              borderRadius: 4,
              backgroundColor: currentIndex === i ? "#4A90E2" : "#ccc",
              marginHorizontal: 4,
            }}
          />
        ))}
      </View> */}

      {/* Button */}
      {/* <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: "#4A90E2",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          marginVertical: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {currentIndex === carousel_data.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

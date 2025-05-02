import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { View, Text, Image, Dimensions, StyleSheet, Platform, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { CustomButton } from "../../Components/CustomButton";
const { width: screenWidth } = Dimensions.get("window");
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../Constants";
type GetstartedNavigationProp = StackNavigationProp<StackParamList, "GetStarted">;

interface Props {
  navigation: GetstartedNavigationProp;
}
interface CarouselItem {
  id: string;
  image: any;
  title: string;
  des: string;
}
export default function Getstarted({ navigation }: Props) {
  function signup() {
    navigation.navigate("SignUp");
  }
  function login() {
    navigation.navigate("Login");
  }
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  const data = [
    {
      id: "1",
      image: require("../../assets/Control.png"),
      title: "Gain total control of your money",
      des: "Become your own money manager and make every cent count",
    },
    {
      id: "2",
      image: require("../../assets/Know.png"),
      title: "Know where your money goes",
      des: "Track your transaction easily,with categories and financial report",
    },
    {
      id: "3",
      image: require("../../assets/Plan.png"),
      title: "Planning activities in budget",
      des: "Setup your budget for each category so you in control",
    },
  ];
  const render = ({ item }: { item: CarouselItem }) => {
    return (
      <View style={styles.view}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{t(item.title)}</Text>
        <Text style={styles.des}>{t(item.des)}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ alignItems: "center", flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <View style={{ flex: 0.75, alignItems: "center", justifyContent: "center" }}>
        <Carousel
          data={data}
          renderItem={render}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
          width={screenWidth}
          style={{ flex: 0.95 }}
          onSnapToItem={(index) => setActiveIndex(index)}
        ></Carousel>
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
          ))}
        </View>
      </View>

      <View
        style={{
          flex: 0.2,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <CustomButton title={t(StringConstants.SignUp)} bg="rgb(42, 124, 118)" color="white" press={signup} />
        <CustomButton
          title={t(StringConstants.Login)}
          bg="rgba(220, 234, 233, 0.6)"
          color="rgb(42, 124, 118)"
          press={login}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  image: {
    height: "70%",
    width: "75%",
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 32,
    textAlign: "center",
    width: "90%",
  },
  des: {
    width: "75%",
    paddingTop: 10,
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 16,
    textAlign: "center",
    color: " rgba(145, 145, 159, 1)",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.05,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: "#C1C1C1",
  },
  activeDot: {
    backgroundColor: "rgb(42, 124, 118) ",
    width: Platform.OS === "ios" ? 15 : 14,
    height: Platform.OS === "ios" ? 15 : 14,
    borderRadius: 10,
  },
});

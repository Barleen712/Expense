import React, { useContext } from "react";
import { ScrollView, View, Text, Image, Dimensions } from "react-native";
import { ThemeContext } from "../../../../../Context/ThemeContext";
import getStyles from "./styles";
import Header from "../../../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const width = Dimensions.get("screen").width * 0.9;
const height = Dimensions.get("screen").height * 0.49;
const carousel_data = [
  {
    id: "1",
    title: "Seamless Expense Tracking",
    image: require("../../../../../assets/instant.png"),
    des: "Log daily expenses , incomes and transfers effortlessly",
  },
  {
    id: "2",
    image: require("../../../../../assets/CustomBudget.png"),
    title: "Custom Budget",
    des: "Set, monitor, and adjust budgets across various categories",
  },
  {
    id: "3",
    title: "Real-Time Insights",
    image: require("../../../../../assets/realTime.png"),
    des: "Visual reports and analytics to help you understand your spending patterns",
  },
  {
    id: "4",
    title: "Secure & Private",
    image: require("../../../../../assets/Encrypt.png"),
    des: "Your financial data is encrypted and protected at all times",
  },
  {
    id: "5",
    image: require("../../../../../assets/encrption.png"),
    title: "Multi-Device Access",
    des: "Manage your finances anytime, anywhere",
  },
];
export default function AboutUs({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  const render = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <View style={{ height: "20%", justifyContent: "center", width: "90%" }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {item.title}
          </Text>
        </View>
        <Image style={{ height: "60%", width: "70%" }} source={item.image}></Image>
        <View style={{ height: "20%", justifyContent: "center", width: "90%", marginBottom: 5 }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {item.des}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header title="About" press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.headView}>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="bookmarks" size={30} color="rgba(42, 124, 118, 1)" />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>About-Us</Text>
          </View>
          <Text style={{ color: colors.color }}>
            Welcome to <Text style={styles.span}>Montra </Text>- your smart solution for managing personal finances with
            ease. {"\n\n"}
            At Montra , our mission is simple :{" "}
            <Text style={styles.span}>to help you gain control over your money and achieve finacial wellness.</Text>
            We understand that managing expenses, tracking spending habits, and planning budgets can be overwhelming,
            especially in a fast-paced world. That's why we've built a user-friendly, intuitive expense tracker that
            empowers you to take charge of your financial life.
          </Text>
        </View>
        <View style={styles.carousel}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6 name="magnifying-glass-dollar" size={30} color="rgba(42, 124, 118, 1)" />
            {/* <MaterialCommunityIcons name="bullseye-arrow" size={30} color="rgba(42, 124, 118, 1)" /> */}
            <Text style={styles.offer}> What We Offer</Text>
          </View>
          <Carousel
            data={carousel_data}
            renderItem={render}
            loop={true}
            autoPlay={true}
            autoPlayInterval={3000}
            width={width * 0.9}
            style={{ height: height, alignItems: "center" }}
            //  style={{ flex: 0.95 }}
            //   onSnapToItem={(index) => setActiveIndex(index)}
          ></Carousel>
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: colors.backgroundColor,
            padding: 16,
            borderRadius: 25,
            marginVertical: 8,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="bullseye-arrow" size={30} color="rgba(42, 124, 118, 1)" />
            <Text style={styles.offer}>Our Vision</Text>
          </View>
          <Text style={{ color: colors.color }}>
            We believe financial awareness is the first step to financial freedom. Our goal is to make budgeting and
            expense tracking accessible and effective for everyone - whether you're a student, a working professional,
            or managing a household.
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: colors.backgroundColor,
            padding: 16,
            borderRadius: 25,
            marginVertical: 8,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="contact-support" size={30} color="rgba(42, 124, 118, 1)" />
            <Text style={styles.offer}>Get in Touch</Text>
          </View>
          <Text style={{ color: colors.color }}>
            Have questions, feedback, or suggestion?{"\n"}
            We'd love to hear from you!{"\n"}
            Email us at: support_montra@yopmail.com. {"\n\n"}
            Let Montra be your financial companion <Text style={styles.span}>-one transaction at a time</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

import React, { useState } from "react";
import { Alert, Animated, StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { Ionicons } from "@expo/vector-icons";
import Home from "../Screens/DrawerScreens/Home/Home";
import Transaction from "../Screens/DrawerScreens/Transaction/Transaction";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "./StackList";
import Budget from "../Screens/DrawerScreens/Budget/Budget";
import Profile from "../Screens/DrawerScreens/Profile/Profile";
import { StringConstants } from "../Screens/Constants";
import { useTranslation } from "react-i18next";
type BottomTabprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: BottomTabprop;
}
export default function Tabscreens({ navigation }: Props) {
  const _renderIcon = (routeName: string, selectedTab: string): JSX.Element => {
    let icon = "";

    switch (routeName) {
      case "Home":
        icon = "home";
        break;
      case "Transactions":
        icon = "cash";
        break;
      case "Budget":
        icon = "wallet";
        break;
      case "Profile":
        icon = "person";
        break;
      default:
        icon = "add-outline";
    }

    return <Ionicons name={icon} size={25} color={routeName === selectedTab ? "rgb(42, 124, 118)" : "gray"} />;
  };
  interface renderCircle {
    routeName: string;
    selectedTab: string;
    navigate: any;
  }
  const { t } = useTranslation();
  const renderTabBar = ({ routeName, selectedTab, navigate }: renderCircle) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
      {_renderIcon(routeName, selectedTab)}
      <Text style={[styles.tabText, { color: routeName === selectedTab ? "rgb(42, 124, 118)" : "gray" }]}>
        {t(routeName)}
      </Text>
    </TouchableOpacity>
  );
  const [plus, setplus] = useState(true);
  const [cross, setcross] = useState(false);

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      height={70}
      circleWidth={56}
      bgColor="white"
      initialRouteName="Home"
      borderTopLeftRight
      renderCircle={() => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setplus(!plus);
              setcross(!cross);
            }}
          >
            {plus && <Ionicons name="add-outline" size={30} color="white" />}
            {cross && <Ionicons name="close-outline" size={30} color="white" />}
            {cross && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Transfer")}
                style={{
                  position: "absolute",
                  left: -15,
                  right: 0,
                  bottom: 125,
                }}
              >
                <Image source={require("../assets/TransferButton.png")} />
              </TouchableOpacity>
            )}
            {cross && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Expense")}
                style={{ position: "absolute", left: 55, bottom: 55 }}
              >
                <Image source={require("../assets/ExpenseButton.png")} />
              </TouchableOpacity>
            )}
            {cross && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Income")}
                style={{ position: "absolute", right: 55, bottom: 55 }}
              >
                <Image source={require("../assets/IncomeButton.png")} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <CurvedBottomBarExpo.Screen name="Home" position="LEFT" component={Home} />
      <CurvedBottomBarExpo.Screen name="Transactions" position="LEFT" component={Transaction} />
      <CurvedBottomBarExpo.Screen name="Budget" position="RIGHT" component={Budget} />
      <CurvedBottomBarExpo.Screen name="Profile" position="RIGHT" component={Profile} />
    </CurvedBottomBarExpo.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {},
  btnCircleUp: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(42, 124, 118)",
    bottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3,
  },
});

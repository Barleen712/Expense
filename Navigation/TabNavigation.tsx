import React, { useState, useEffect, useContext } from "react";
import { Animated, StyleSheet, TouchableOpacity, Text } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { Ionicons } from "@expo/vector-icons";
import Home from "../Screens/DrawerScreens/Home/Home";
import Transaction from "../Screens/DrawerScreens/Transaction/Transaction";
import Budget from "../Screens/DrawerScreens/Budget/Budget/Budget";
import Profile from "../Screens/DrawerScreens/Profile/Profile";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "./StackList";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Context/ThemeContext";
import Expense from "../assets/Expense.svg";
import Income from "../assets/Income.svg";
import Transfer from "../assets/Transaction.svg";

type BottomTabprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: BottomTabprop;
}

export default function Tabscreens({ navigation }: Readonly<Props>) {
  const loading = useSelector((state: RootState) => state.Money.loading);
  const [plus, setplus] = useState(true);
  const [cross, setcross] = useState(false);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);
  const styles = getstyles(colors);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setplus(true);
      setcross(false);
    });
    return unsubscribe;
  }, [navigation]);

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

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
      {_renderIcon(routeName, selectedTab)}
      <Text style={[styles.tabText, { color: routeName === selectedTab ? "rgb(42, 124, 118)" : "gray" }]}>
        {t(routeName)}
      </Text>
    </TouchableOpacity>
  );
  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={[styles.bottomBar, loading && { display: "none" }]}
      shadowStyle={styles.shadow}
      height={70}
      circleWidth={56}
      bgColor="transparent"
      initialRouteName="Home"
      borderTopLeftRight
      screenOptions={{ headerShown: false }}
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
                onPress={() =>
                  navigation.navigate("Transfer", {
                    from: "",
                    to: "",
                    amount: 0,
                    id: " ",
                    edit: false,
                    title: "",
                  })
                }
                style={{
                  position: "absolute",
                  left: -15,
                  right: 0,
                  bottom: 125,
                }}
              >
                <Transfer />
              </TouchableOpacity>
            )}
            {cross && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Expense", {
                    amount: 0,
                    category: "Category",
                    edit: false,
                    title: "",
                    wallet: "Wallet",
                  })
                }
                style={{ position: "absolute", left: 55, bottom: 55 }}
              >
                <Expense />
              </TouchableOpacity>
            )}
            {cross && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Income", {
                    amount: 0,
                    category: "Category",
                    edit: false,
                    title: "",
                    wallet: "Wallet",
                  })
                }
                style={{ position: "absolute", right: 55, bottom: 55 }}
              >
                <Income />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen name="Home" position="LEFT" component={Home} />
      <CurvedBottomBarExpo.Screen name="Transactions" position="LEFT" component={Transaction} />
      <CurvedBottomBarExpo.Screen name="Budget" position="RIGHT" component={Budget} />
      <CurvedBottomBarExpo.Screen name="Profile" position="RIGHT" component={Profile} />
    </CurvedBottomBarExpo.Navigator>
  );
}

function getstyles(colors) {
  return StyleSheet.create({
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
    bottomBar: {
      backgroundColor: colors.backgroundColor,
    },
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundColor,
    },
  });
}

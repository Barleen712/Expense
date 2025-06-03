import React, { useState, useEffect, useContext } from "react";
import { Animated, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
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
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
import Expense from "../assets/Expense.svg";
import Income from "../assets/Income.svg";
import Transfer from "../assets/Transaction.svg";

type BottomTabprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: BottomTabprop;
}

export default function Tabscreens({ navigation }: Readonly<Props>) {
  const loading = useSelector((state: RootState) => state.Money.loading);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  const now = new Date();

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setIsExpanded(false);
    });
    return unsubscribe;
  }, [navigation]);

  const renderIcon = (routeName: string, selectedTab: string): JSX.Element => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      Home: "home",
      Transactions: "cash",
      Budget: "wallet",
      Profile: "person",
    };
    const iconName = icons[routeName] || "add-outline";
    const color = routeName === selectedTab ? "rgb(42, 124, 118)" : "gray";

    return <Ionicons name={iconName} size={25} color={color} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
      {renderIcon(routeName, selectedTab)}
      <Text style={[styles.tabText, { color: routeName === selectedTab ? "rgb(42, 124, 118)" : "gray" }]}>
        {t(routeName)}
      </Text>
    </TouchableOpacity>
  );

  const getTransactionProps = ({
    moneyCategory,
    categoryData,
    modal,
    bg,
  }: {
    moneyCategory: string;
    categoryData: { label: string; value: string }[];
    modal: any[];
    bg: string;
  }) => ({
    amount: 0,
    category: "Category",
    categoryData,
    modal,
    edit: false,
    title: "",
    wallet: "Wallet",
    url: "",
    frequency: "",
    endDate: now.toISOString(),
    endAfter: "",
    repeat: false,
    startDate: now.getDate(),
    startMonth: now.getMonth(),
    weekly: now.getDay().toString(),
    type: "",
    bg,
    moneyCategory,
  });

  const expenseProps = getTransactionProps({
    moneyCategory: "Expense",
    categoryData: [
      { label: "Shopping", value: "Shopping" },
      { label: "Food", value: "Food" },
      { label: "Entertainment", value: "Entertainment" },
      { label: "Subscription", value: "Subscription" },
      { label: "Transportation", value: "Transportation" },
      { label: "Bills", value: "Bills" },
      { label: "Miscellaneous", value: "Miscellaneous" },
    ],
    modal: [
      require("../assets/CameraRed.png"),
      require("../assets/ImageRed.png"),
      require("../assets/DocumentRed.png"),
    ],
    bg: "rgb(255, 0, 17)",
  });

  const incomeProps = getTransactionProps({
    moneyCategory: "Income",
    categoryData: [
      { label: "Salary", value: "Salary" },
      { label: "Passive Income", value: "Passive Income" },
    ],
    modal: [require("../assets/Camera.png"), require("../assets/Image.png"), require("../assets/Document.png")],
    bg: "rgba(0, 168, 107, 1)",
  });

  return (
    <CurvedBottomBarExpo.Navigator
      id="main"
      circlePosition="CENTER"
      type="DOWN"
      width={Dimensions.get("window").width}
      style={[styles.bottomBar, loading && { display: "none" }]}
      shadowStyle={styles.shadow}
      height={70}
      circleWidth={56}
      bgColor="transparent"
      initialRouteName="Home"
      borderTopLeftRight
      backBehavior="initialRoute"
      borderColor="gray"
      borderWidth={0}
      defaultScreenOptions={{ headerShown: false }}
      screenOptions={{ headerShown: false }}
      renderCircle={() => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity style={styles.button} onPress={() => setIsExpanded((prev) => !prev)}>
            <Ionicons name={isExpanded ? "close-outline" : "add-outline"} size={30} color="white" />

            {isExpanded && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Transfer", {
                      from: "",
                      to: "",
                      amount: 0,
                      id: " ",
                      edit: false,
                      title: "",
                      url: "",
                      type: "",
                    })
                  }
                  style={[styles.actionButton, { bottom: 125, left: -15 }]}
                >
                  <Transfer />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Transaction", expenseProps)}
                  style={[styles.actionButton, { bottom: 55, left: 55 }]}
                >
                  <Expense />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Transaction", incomeProps)}
                  style={[styles.actionButton, { bottom: 55, right: 55 }]}
                >
                  <Income />
                </TouchableOpacity>
              </>
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

function getStyles(colors: any) {
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
    actionButton: {
      position: "absolute",
    },
  });
}

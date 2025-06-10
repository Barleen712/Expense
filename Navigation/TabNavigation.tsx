import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, Dimensions, View, TouchableWithoutFeedback } from "react-native";
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
import CameraGreen from "../assets/CameraGreen.svg";
import ImageGreen from "../assets/ImageGreen.svg";
import DocumentGreen from "../assets/DocumentGreen.svg";
import CameraRed from "../assets/CameraRed.svg";
import ImageRed from "../assets/ImageRed.svg";
import DocumentRed from "../assets/DocumentRed.svg";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

type BottomTabprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: BottomTabprop;
}

export default function Tabscreens({ navigation }: Readonly<Props>) {
  const TranslateXTransfer = useSharedValue(0);
  const TranslateYTransfer = useSharedValue(0);
  const TranslateXIncome = useSharedValue(0);
  const TranslateYIncome = useSharedValue(0);
  const TranslateXExpense = useSharedValue(0);
  const TranslateYExpense = useSharedValue(0);
  const RotateAngle = useSharedValue(0);
  const OpacityValue = useSharedValue(0);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const loading = useSelector((state: RootState) => state.Money.loading);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  const now = new Date();
  function handleTranslation() {
    setIsExpanded((prev) => {
      const nextExpanded = !prev;

      if (nextExpanded) {
        OpacityValue.value = withTiming(1);
        TranslateXTransfer.value = withTiming(0);
        TranslateYTransfer.value = withTiming(-65);
        TranslateXIncome.value = withTiming(-35);
        TranslateYIncome.value = withTiming(-28);
        TranslateXExpense.value = withTiming(35);
        TranslateYExpense.value = withTiming(-28);
        RotateAngle.value = withTiming(90);
      } else {
        OpacityValue.value = withTiming(0);
        TranslateXTransfer.value = withTiming(0);
        TranslateYTransfer.value = withTiming(0);
        TranslateXIncome.value = withTiming(0);
        TranslateYIncome.value = withTiming(0);
        TranslateXExpense.value = withTiming(0);
        TranslateYExpense.value = withTiming(0);
        RotateAngle.value = withTiming(0);
      }

      return nextExpanded;
    });
  }

  const animatedStyleTransfer = useAnimatedStyle(() => ({
    transform: [{ translateX: TranslateXTransfer.value * 2 }, { translateY: TranslateYTransfer.value * 2 }],
  }));

  const animatedStyleIncome = useAnimatedStyle(() => ({
    transform: [{ translateX: TranslateXIncome.value * 2 }, { translateY: TranslateYIncome.value * 2 }],
  }));

  const animatedStyleExpense = useAnimatedStyle(() => ({
    transform: [{ translateX: TranslateXExpense.value * 2 }, { translateY: TranslateYExpense.value * 2 }],
  }));

  const animateStyleRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${RotateAngle.value}deg` }],
  }));

  const sharedActionStyle = useAnimatedStyle(() => ({
    opacity: OpacityValue.value,
    pointerEvents: OpacityValue.value === 0 ? "none" : "auto",
  }));

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setIsExpanded(false);
      OpacityValue.value = withTiming(0);
      RotateAngle.value = withTiming(0);
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
    modal: [CameraRed, ImageRed, DocumentRed],
    bg: "rgb(255, 0, 17)",
  });

  const incomeProps = getTransactionProps({
    moneyCategory: "Income",
    categoryData: [
      { label: "Salary", value: "Salary" },
      { label: "Passive Income", value: "Passive Income" },
    ],
    modal: [CameraGreen, ImageGreen, DocumentGreen],
    bg: "rgba(0, 168, 107, 1)",
  });

  return (
    <>
      {isExpanded && (
        <TouchableWithoutFeedback onPress={handleTranslation}>
          <LinearGradient
            colors={["rgba(213, 237, 230, 0.1)", "rgb(213, 237, 230)"]}
            style={{
              // backgroundColor: "rgba(213, 237, 230, 0.89)",
              position: "absolute",
              top: 10,
              height: "90%",
              width: "100%",
              zIndex: 1,
            }}
          ></LinearGradient>
        </TouchableWithoutFeedback>
      )}
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
        screenListeners={() => ({})}
        renderCircle={() => (
          <View>
            <AnimatedTouchable
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
              style={[styles.actionButton, { zIndex: 2 }, animatedStyleTransfer, sharedActionStyle]}
            >
              <Transfer />
            </AnimatedTouchable>

            <AnimatedTouchable
              onPress={() => navigation.navigate("Transaction", expenseProps)}
              style={[styles.actionButton, { zIndex: 3 }, animatedStyleExpense, sharedActionStyle]}
            >
              <Expense />
            </AnimatedTouchable>

            <AnimatedTouchable
              onPress={() => navigation.navigate("Transaction", incomeProps)}
              style={[styles.actionButton, { zIndex: 4 }, animatedStyleIncome, sharedActionStyle]}
            >
              <Income />
            </AnimatedTouchable>

            <Animated.View style={styles.btnCircleUp}>
              <AnimatedTouchable style={[styles.button, animateStyleRotation]} onPress={handleTranslation}>
                <Ionicons name={"add-outline"} size={30} color="white" />
              </AnimatedTouchable>
            </Animated.View>
          </View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBarExpo.Screen name="Home" position="LEFT" component={Home} />
        <CurvedBottomBarExpo.Screen name="Transactions" position="LEFT" component={Transaction} />
        <CurvedBottomBarExpo.Screen name="Budget" position="RIGHT" component={Budget} />
        <CurvedBottomBarExpo.Screen name="Profile" position="RIGHT" component={Profile} />
      </CurvedBottomBarExpo.Navigator>
    </>
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
      zIndex: 4,
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
      zIndex: 9999999,
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
      left: 0,
      bottom: 40,
    },
  });
}

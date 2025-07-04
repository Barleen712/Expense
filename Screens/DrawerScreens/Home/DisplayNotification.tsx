import React, { useContext, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, SafeAreaView, Platform, TouchableWithoutFeedback } from "react-native";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { removeNotification, updateBadge, updateNotifications } from "../../../Slice/IncomeSlice";
import { deleteAllUserNotifications, updateNotification } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { RootState, store } from "../../../Store/Store";
import { currencies } from "../../Constants";
type NotificationProp = StackNavigationProp<StackParamList, "Notification">;

interface Notification {
  navigation: NotificationProp;
}
export default function DisplayNotification({ navigation }: Readonly<Notification>) {
  const NotificationData = useSelector((state: RootState) => state.Money.notification);
  const sortedNotification = [...NotificationData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { t } = useTranslation();
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];

  console.log(NotificationData);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t("Notification")}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      {show && (
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0)",
              zIndex: 99,
            }}
          />
        </TouchableWithoutFeedback>
      )}
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{ position: "absolute", right: "5%", top: Platform.OS === "android" ? "6%" : "10%" }}
      >
        <Entypo name="dots-three-horizontal" size={24} color={colors.color} />
      </TouchableOpacity>

      {show && (
        <View
          style={{
            position: "absolute",
            right: "5%",
            top: "12%",
            height: 94,
            width: 134,
            backgroundColor: "white",
            justifyContent: "space-evenly",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            zIndex: 100,
            paddingLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(updateBadge(0));
              updateNotification(auth.currentUser?.uid);
              dispatch(updateNotifications());
              setShow(false);
            }}
          >
            <Text>{t("Mark all read")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await deleteAllUserNotifications(auth.currentUser?.uid);
              dispatch(removeNotification());
              dispatch(updateBadge(0));
              setShow(false);
            }}
          >
            <Text>{t("Remove all")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1, alignItems: "center", width: "100%", backgroundColor: colors.backgroundColor }}>
        {sortedNotification.length === 0 ? (
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Text style={styles.budgetText}>{t("There is no notification for now")}</Text>
          </View>
        ) : (
          <FlatList
            data={sortedNotification}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 50 }}
            style={{ width: "100%" }}
            renderItem={({ item }) => {
              const date = new Date(item.date);
              let hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, "0");
              const meridiem = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;
              let formattedTime = `${hours}:${minutes} ${meridiem}`;
              let DisplayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              if (
                new Date(item.date).getDate() === new Date().getDate() &&
                new Date(item.date).getMonth() === new Date().getMonth() &&
                new Date(item.date).getFullYear() === new Date().getFullYear()
              ) {
                DisplayDate = "Today";
              }
              if (
                new Date(item.date).getDate() === new Date().getDate() - 1 &&
                new Date(item.date).getMonth() === new Date().getMonth() &&
                new Date(item.date).getFullYear() === new Date().getFullYear()
              ) {
                DisplayDate = "Yesterday";
              }
              return (
                <View style={{ width: "100%", alignItems: "center", marginBottom: 15, marginTop: 5 }}>
                  <View
                    style={{
                      width: "90%",
                      backgroundColor: item.read ? "rgba(237, 234, 234, 0.28)" : " rgba(42, 124, 118, 0.33)",
                      height: 100,
                      borderRadius: 20,
                      flexDirection: "row",
                    }}
                  >
                    {!item.read && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: " rgb(42, 124, 118)",
                          position: "absolute",
                          borderRadius: 10,
                          left: "-4%",
                          top: "45%",
                        }}
                      >
                        <View />
                      </View>
                    )}
                    <View style={{ width: "78%", justifyContent: "center", paddingLeft: 10 }}>
                      <Text style={{ fontWeight: "bold", color: colors.color }}>{item.title}</Text>
                      <Text style={{ color: "grey" }}>
                        {item.body} {item.amount && `${currencies[currency]} ${(item.amount * convertRate).toFixed(2)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingLeft: 5,
                        width: "22%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.color,
                          width: "100%",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {DisplayDate}
                      </Text>
                      <Text style={{ color: "grey", fontSize: 12, width: "100%", textAlign: "center" }}>
                        {formattedTime}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

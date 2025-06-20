import React, { useContext, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { removeNotification, updateBadge } from "../../../Slice/IncomeSlice";
import { deleteAllUserNotifications, updateNotification } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { RootState, store } from "../../../Store/Store";
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
  return (
    <View style={styles.container}>
      <Header
        title={t("Notification")}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <TouchableOpacity onPress={() => setShow(!show)} style={{ position: "absolute", right: "5%", top: "7%" }}>
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
            zIndex: 10,
            paddingLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(updateBadge(0));
              updateNotification(auth.currentUser?.uid);
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
              const formattedTime = `${hours}:${minutes} ${meridiem}`;
              const DisplayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              return (
                <View style={{ width: "100%", alignItems: "center", marginBottom: 15, marginTop: 5 }}>
                  <View
                    style={{
                      width: "90%",
                      backgroundColor: "rgba(237, 234, 234, 0.28)",
                      height: 100,
                      borderRadius: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "78%", justifyContent: "center", paddingLeft: 10 }}>
                      <Text style={{ fontWeight: "bold", color: colors.color }}>{item.title}</Text>
                      <Text style={{ color: "grey" }}>{item.body}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: 5, width: "22%" }}>
                      <Text style={{ fontSize: 12, color: colors.color }}>{DisplayDate}</Text>
                      <Text style={{ color: "grey", fontSize: 12 }}>{formattedTime}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { removeNotification } from "../../../Slice/IncomeSlice";
import { deleteAllUserNotifications } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { updateBadge } from "../../../Slice/IncomeSlice";
export default function DisplayNotification({ navigation }) {
  const NotificationData = useSelector((state) => state.Money.notification);
  const sortedNotification = [...NotificationData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  return (
    <TouchableWithoutFeedback onPress={() => setShow(false)}>
      <View style={styles.container}>
        <Header title="Notification" press={() => navigation.goBack()} />
        <TouchableOpacity onPress={() => setShow(!show)} style={{ position: "absolute", right: "5%", top: "8%" }}>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
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
              alignItems: "center",
              justifyContent: "space-evenly",
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                dispatch(updateBadge(0));
                setShow(false);
              }}
            >
              <Text>Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(removeNotification());
                deleteAllUserNotifications(auth.currentUser?.uid);
                setShow(false);
              }}
            >
              <Text>Remove all</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
          {sortedNotification.length === 0 ? (
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text style={styles.budgetText}>There is no notification for now</Text>
            </View>
          ) : (
            <FlatList
              data={sortedNotification}
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
                        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                        <Text style={{ color: "grey" }}>{item.body}</Text>
                      </View>
                      <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: 5, width: "22%" }}>
                        <Text style={{ fontSize: 12 }}>{DisplayDate}</Text>
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
    </TouchableWithoutFeedback>
  );
}

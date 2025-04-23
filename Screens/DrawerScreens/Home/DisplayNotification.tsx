import React from "react";
import { View, FlatList, Text } from "react-native";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
import { useSelector } from "react-redux";
export default function DisplayNotification({ navigation }) {
  const NotificationData = useSelector((state) => state.Money.notification);
  const sortedNotification = [...NotificationData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  return (
    <View style={styles.container}>
      <Header title="Notification" press={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
        {sortedNotification.length === 0 ? (
          <View style={[styles.budgetView, { justifyContent: "center" }]}>
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
              let day = date.getDate();
              let month = date.getMonth() + 1;
              let year = date.getFullYear();
              let DisplayDate = `${day}/${month}/${year}`;
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
  );
}

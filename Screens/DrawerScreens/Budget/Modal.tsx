import React, { useState } from "react";
import { Modal, View, Image, Text } from "react-native";
import styles from "../../Stylesheet";

import { CustomButton } from "../../../Components/CustomButton";
export default function CustomModal({ visible, setVisible, color, bg, head, text, navigation, onsuccess, deleteT }) {
  function toggleModal() {
    setVisible();
  }
  const [success, setsuccess] = useState(false);
  function toggleSuccess() {
    toggleModal();
    setsuccess(true);
    setTimeout(() => {
      deleteT();
      setsuccess(false);
      navigation.goBack();
    }, 3000);
  }
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: "30%" }]}>
            <Text style={styles.logout}>{head}</Text>
            <Text style={[styles.quesLogout, { width: "80%", textAlign: "center" }]}>{text}</Text>
            <View style={styles.modalButton}>
              <View style={styles.modalY}>
                <CustomButton title="Yes" bg={bg} color="white" press={toggleSuccess} />
              </View>
              <View style={styles.modalN}>
                <CustomButton title="No" bg={color} color={bg} press={toggleModal} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={success} onRequestClose={toggleSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerTransaction}>
            <Image
              style={styles.deleteTrans}
              source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/success.png")}
            />
            <Text
              style={[
                styles.quesLogout,
                {
                  width: "80%",
                  textAlign: "center",
                  color: "black",
                  fontWeight: "bold",
                },
              ]}
            >
              {onsuccess}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

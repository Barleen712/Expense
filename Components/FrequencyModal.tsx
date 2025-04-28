import react, { useState } from "react";
import { Modal, View, Text, Touchable, TouchableOpacity, Platform } from "react-native";
import styles from "../Screens/Stylesheet";
import CustomD from "./Practice";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../Screens/Constants";
import { CustomButton } from "./CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
const Frequency = ["Yearly", "Monthly", "Weekly", "Daily"];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const date = [];
for (let i = 1; i <= 31; i++) {
  date.push(i);
}
const year = [];
for (let i = 0; i <= 31; i++) {
  year.push(new Date().getFullYear() + i);
}

export default function FrequencyModal({ frequency, setFrequency, endAfter, setendAfter }) {
  const [modalVisible, setModalVisible] = useState(true);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const { t } = useTranslation();
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()]);
  const [startDate, setStartDate] = useState(date[new Date().getMonth()]);
  const [endDate, setEndDate] = useState(new Date());
  function handleEndDateChange(event, selectedDate) {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
      setendAfter(selectedDate);
    }
  }
  console.log(frequency, month, startDate);
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { height: "35%" }]}>
          <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}>
            <View style={{ width: frequency ? "30%" : "100%", alignItems: "center" }}>
              <CustomD
                name={"Frequency"}
                data={Frequency}
                styleButton={styles.textinput}
                styleItem={styles.dropdownItems}
                styleArrow={styles.arrowDown}
                onSelectItem={(item) => {
                  setFrequency(item);
                }}
              />
            </View>
            {frequency && (
              <View style={{ width: "30%", flexDirection: "row" }}>
                <CustomD
                  name={month}
                  data={Month}
                  styleButton={styles.textinput}
                  styleItem={styles.dropdownItems}
                  styleArrow={styles.arrowDown}
                  onSelectItem={(item) => {
                    setMonth(item);
                  }}
                />
              </View>
            )}
            {frequency && (
              <View style={{ width: "30%", flexDirection: "row" }}>
                <CustomD
                  name={startDate}
                  data={date}
                  styleButton={styles.textinput}
                  styleItem={styles.dropdownItems}
                  styleArrow={styles.arrowDown}
                  onSelectItem={(item) => {
                    setStartDate(item);
                  }}
                />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.textinput, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{endAfter ? `End After: ${new Date(endDate).toDateString()}` : "Select End Date :"}</Text>
            {endAfter === "" && (
              <DateTimePicker value={endDate} mode="date" display="default" onChange={handleEndDateChange} />
            )}
          </TouchableOpacity>
          <CustomButton
            title={t(StringConstants.Continue)}
            bg="rgba(0, 168, 107, 1)"
            color="white"
            press={() => setModalVisible(!modalVisible)}
          />
        </View>
      </View>
    </Modal>
  );
}

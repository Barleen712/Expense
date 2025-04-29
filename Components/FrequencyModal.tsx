import react, { useState } from "react";
import { Modal, View, Text, Touchable, TouchableOpacity, Platform } from "react-native";
import styles from "../Screens/Stylesheet";
import CustomD from "./Practice";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../Screens/Constants";
import { CustomButton } from "./CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Frequency = ["Yearly", "Monthly", "Weekly", "Daily"];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const EndAfter = ["Date", "Never"];
import { Weeks } from "../Screens/Constants";
const date = [];
for (let i = 1; i <= 31; i++) {
  date.push(i);
}
const year = [];
for (let i = 0; i <= 31; i++) {
  year.push(new Date().getFullYear() + i);
}

export default function FrequencyModal({
  frequency,
  setFrequency,
  endAfter,
  setendAfter,
  color,
  month,
  setMonth,
  week,
  setWeek,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  Frequencymodal,
  setFrequencyModal,
}) {
  const { t } = useTranslation();
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={Frequencymodal}
      onRequestClose={() => setFrequencyModal(!Frequencymodal)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { height: "35%" }]}>
          <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
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
            {frequency === "Yearly" && (
              <View style={{ flexDirection: "row", flex: 1 }}>
                <CustomD
                  name={Month[month]}
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
            {frequency === "Weekly" && (
              <View style={{ flexDirection: "row", flex: 1 }}>
                <CustomD
                  name={Weeks[week]}
                  data={Weeks}
                  styleButton={styles.textinput}
                  styleItem={styles.dropdownItems}
                  styleArrow={styles.arrowDown}
                  onSelectItem={(item) => {
                    setWeek(item);
                  }}
                />
              </View>
            )}
            {(frequency === "Yearly" || frequency === "Monthly") && (
              <View style={{ flexDirection: "row", flex: 1 }}>
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
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <CustomD
                name={"End After"}
                data={EndAfter}
                styleButton={styles.textinput}
                styleItem={styles.dropdownItems}
                styleArrow={styles.arrowDown}
                onSelectItem={(item) => {
                  setendAfter(item);
                }}
              />
            </View>
            {endAfter === "Date" && (
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={[styles.textinput, { flex: 1, flexDirection: "row", justifyContent: "space-between" }]}
              >
                <Text>{endAfter ? ` ${new Date(endDate).toDateString()}` : "Select End Date :"}</Text>
                {showEndDatePicker && (
                  <DateTimePicker value={endDate} mode="date" display="default" onChange={onChange} />
                )}
                <FontAwesome name="calendar" size={24} color="grey" />
              </TouchableOpacity>
            )}
          </View>
          <CustomButton
            title={t(StringConstants.Continue)}
            bg={color}
            color="white"
            press={() => setFrequencyModal(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

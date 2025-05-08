import React, { useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from "react-native";
import styles from "../Screens/Stylesheet";
import DropdownComponent from "./DropDown";
import { useTranslation } from "react-i18next";
import { StringConstants, Weeks } from "../Screens/Constants";
import { CustomButton } from "./CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeContext } from "../Context/ThemeContext";

const Frequency = ["Yearly", "Monthly", "Weekly", "Daily"].map((item) => ({
  label: item,
  value: item,
}));

const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"].map((item) => ({
  label: item,
  value: item,
}));

const EndAfter = ["Date", "Never"].map((item) => ({
  label: item,
  value: item,
}));

const date = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));
const weekDropdownData = Weeks.map((day, index) => ({
  label: day,
  value: index.toString(), // or just use 'day' as value if preferred
}));

const year = Array.from({ length: 32 }, (_, i) => new Date().getFullYear() + i);

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
    if (Platform.OS === "android") setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };
  const { colors } = useContext(ThemeContext);
  return (
    <Modal
      animationType="slide"
      transparent
      visible={Frequencymodal}
      onRequestClose={() => {
        setFrequencyModal(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setFrequencyModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { height: "35%", backgroundColor: colors.backgroundColor }]}>
              <View
                style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <View style={{ flex: 1, alignItems: "center" }}>
                  <DropdownComponent
                    data={Frequency}
                    value={frequency}
                    name={t("Frequency")}
                    styleButton={styles.textinput}
                    onSelectItem={(item) => {
                      setFrequency(item);
                    }}
                  />
                </View>
                {frequency === "Yearly" && (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <DropdownComponent
                      data={Month}
                      value={month}
                      name={t("Month")}
                      styleButton={styles.textinput}
                      onSelectItem={(item) => {
                        setMonth(item);
                      }}
                    />
                  </View>
                )}
                {frequency === "Weekly" && (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <DropdownComponent
                      data={weekDropdownData}
                      value={week}
                      name={t("Day")}
                      styleButton={styles.textinput}
                      onSelectItem={(item) => {
                        setWeek(item);
                      }}
                    />
                  </View>
                )}
                {(frequency === "Yearly" || frequency === "Monthly") && (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <DropdownComponent
                      data={date}
                      value={startDate}
                      name={startDate}
                      styleButton={styles.textinput}
                      onSelectItem={(item) => {
                        setStartDate(item);
                      }}
                    />
                  </View>
                )}
              </View>

              <View
                style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <View style={{ flex: 1, alignItems: "center" }}>
                  <DropdownComponent
                    data={EndAfter}
                    value={endAfter}
                    name={t("End After")}
                    styleButton={styles.textinput}
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
                    <Text style={{ color: colors.color }}>
                      {endAfter ? ` ${new Date(endDate).toDateString()}` : "Select End Date :"}
                    </Text>
                    {showEndDatePicker && (
                      <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={onChange}
                        minimumDate={new Date()}
                      />
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

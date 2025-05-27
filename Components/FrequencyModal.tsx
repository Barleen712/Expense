import React, { useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from "react-native";
import styles from "../Screens/Stylesheet";
import DropdownComponent from "./DropDown";
import { useTranslation } from "react-i18next";
import { StringConstants, Weeks } from "../Screens/Constants";
import { CustomButton } from "./CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";

const Frequency = ["Yearly", "Monthly", "Weekly", "Daily"].map((item) => ({
  label: item,
  value: item,
}));

const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"].map(
  (item, index) => ({
    label: item,
    value: index,
  })
);

const EndAfter = ["Date", "Never"].map((item) => ({
  label: item,
  value: item,
}));
const ShortM = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const date = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));
const weekDropdownData = Weeks.map((day, index) => ({
  label: day,
  value: index.toString(), // or just use 'day' as value if preferred
}));
const year = Array.from({ length: 32 }, (_, i) => new Date().getFullYear() + i);

type ModalProps = {
  frequency: string;
  setFrequency: (a: string) => void;
  endAfter: string;
  setendAfter: (a: string) => void;
  color: string;
  month: number;
  setMonth: (a: number) => void;
  week: string;
  setWeek: (a: string) => void;
  startDate: number;
  setStartDate: (a: number) => void;
  endDate: Date;
  setEndDate: (a: Date) => void;
  Frequencymodal: boolean;
  setFrequencyModal: (a: boolean) => void;
  setswitch: (a: boolean) => void;
  edit: boolean;
};

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
  setswitch,
  edit,
}: ModalProps) {
  const { t } = useTranslation();
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [frequencyError, setFrequencyError] = useState("");
  const [endAfterError, setEndAfterError] = useState("");

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  function Save() {
    if (frequency === "") {
      setFrequencyError("Select Frequency");
      return;
    }
    if (endAfter === "") {
      setEndAfterError("Select an option");
      return;
    }
    setFrequencyModal(false);
  }
  return (
    <Modal
      animationType="slide"
      transparent
      visible={Frequencymodal}
      onRequestClose={() => {
        setFrequencyModal(false);
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (!edit) {
            setswitch(false);
          }
          setFrequencyModal(false);
        }}
      >
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
                      setFrequencyError("");
                    }}
                    position="bottom"
                    height={120}
                  />
                </View>
                {frequency === "Yearly" && (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <DropdownComponent
                      data={Month}
                      value={month}
                      name={ShortM[month]}
                      styleButton={styles.textinput}
                      onSelectItem={(item) => {
                        setMonth(item);
                      }}
                      position="bottom"
                      height={150}
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
                      position="bottom"
                      height={150}
                    />
                  </View>
                )}
                {(frequency === "Yearly" || frequency === "Monthly") && (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <DropdownComponent
                      data={date}
                      value={startDate.toString()}
                      name={startDate}
                      styleButton={styles.textinput}
                      onSelectItem={(item) => {
                        setStartDate(item);
                      }}
                      position="bottom"
                      height={150}
                    />
                  </View>
                )}
              </View>
              {frequencyError !== "" && (
                <Text
                  style={{
                    color: "rgb(255, 0, 17)",
                    marginTop: 4,
                    marginLeft: 10,
                    fontFamily: "Inter",
                    width: "90%",
                  }}
                >
                  *{frequencyError}
                </Text>
              )}
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
                      setEndAfterError("");
                    }}
                    position="top"
                    height={120}
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
              {endAfterError !== "" && (
                <Text
                  style={{
                    color: "rgb(255, 0, 17)",
                    marginTop: 4,
                    marginLeft: 10,
                    fontFamily: "Inter",
                    width: "90%",
                  }}
                >
                  *{endAfterError}
                </Text>
              )}
              <CustomButton title={t(StringConstants.Continue)} bg={color} color="white" press={Save} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

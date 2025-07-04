import React, { useContext, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Feather"; // Or your icon lib

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownC {
  value: string;
  data: DropdownItem[];
  name: string;
  styleButton: object;
  height?: number;
  position?: "auto" | "top" | "bottom";
  onSelectItem: (selectedItem: string) => void;
  color?: string;
}

const DropdownComponent = ({ name, data, styleButton, value, position, height, onSelectItem, color }: DropdownC) => {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { t } = useTranslation();
  const [isFocus, setIsFocus] = useState(false);

  const translatedData = data.map((item) => ({
    ...item,
    label: t(item.label),
  }));

  const resolvedColor = color ?? colors.color;

  return (
    <Dropdown
      style={styleButton}
      data={translatedData}
      maxHeight={height}
      labelField="label"
      valueField="value"
      value={value}
      containerStyle={{ backgroundColor: colors.backgroundColor }}
      itemTextStyle={{ color: colors.color }}
      placeholder={name}
      dropdownPosition={position}
      autoScroll={false}
      placeholderStyle={{ color: "rgba(145, 145, 159, 1)", fontSize: 16 }}
      selectedTextStyle={{ color: resolvedColor }}
      activeColor={colors.line}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(selectedItem) => {
        setIsFocus(false);
        onSelectItem(selectedItem.value);
      }}
      renderRightIcon={() => <Icon name={isFocus ? "chevron-up" : "chevron-down"} size={20} color="gray" />}
    />
  );
};

export default DropdownComponent;

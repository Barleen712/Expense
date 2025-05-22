import React, { useContext, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ThemeContext } from "../Context/ThemeContext";
import { useTranslation } from "react-i18next";
interface DropdownItem {
  label: string;
  value: string;
}
interface dropdown {
  value: string;
  data: DropdownItem[];
  name: string;
  styleButton: object;
  height: number;
  position: "auto" | "top" | "bottom";
  onSelectItem: (selectedItem: string) => void;
}

const DropdownComponent = ({ name, data, styleButton, value, position, height, onSelectItem }: dropdown) => {
  const { colors } = useContext(ThemeContext);
  const { t } = useTranslation();
  const translatedData = data.map((item) => ({
    ...item,
    label: t(item.label),
  }));
  return (
    <Dropdown
      style={styleButton}
      data={translatedData}
      maxHeight={height}
      labelField="label"
      valueField="value"
      value={value}
      placeholder={name}
      dropdownPosition={position}
      autoScroll={false}
      placeholderStyle={{ color: colors.color }}
      selectedTextStyle={{ color: colors.color }}
      onChange={(selectedItem) => {
        onSelectItem(selectedItem.value);
      }}
    />
  );
};

export default DropdownComponent;

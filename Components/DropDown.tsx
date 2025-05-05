import React, { useContext, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ThemeContext } from "../Context/ThemeContext";
interface DropdownItem {
  label: string;
  value: string;
}
interface dropdown {
  value: string;
  data: DropdownItem[];
  name: string;
  styleButton: object;
  styleItem?: object;
  onSelectItem: (selectedItem: string) => void;
}

const DropdownComponent = ({ name, data, styleButton, value, styleItem, onSelectItem }: dropdown) => {
  const { colors } = useContext(ThemeContext);
  return (
    <Dropdown
      style={styleButton}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      placeholder={name}
      placeholderStyle={{ color: colors.color }}
      selectedTextStyle={{ color: colors.color }}
      onChange={(selectedItem) => {
        onSelectItem(selectedItem.value);
      }}
    />
  );
};

export default DropdownComponent;

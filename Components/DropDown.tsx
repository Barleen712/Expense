import React, { useContext } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
import { useTranslation } from "react-i18next";
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
      placeholder={name}
      dropdownPosition={position}
      autoScroll={false}
      placeholderStyle={{ color: resolvedColor }}
      selectedTextStyle={{ color: resolvedColor }}
      onChange={(selectedItem) => {
        onSelectItem(selectedItem.value);
      }}
    />
  );
};

export default DropdownComponent;

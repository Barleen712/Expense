import SelectDropdown from "react-native-select-dropdown";
import { View, Text, Image } from "react-native";
import styles from "../Screens/Stylesheet";
import { useTranslation } from "react-i18next";
interface dropdown {
  data: Array<string>;
  name: string;
  styleButton: object;
  styleItem: object;
  styleArrow: object;
  onSelectItem: (selectedItem: string, index: number) => void;
}
export default function CustomD({ name, data, styleButton, styleItem, styleArrow, onSelectItem }: dropdown) {
  const { t } = useTranslation();
  const translatedData = data.map((item) => t(item));
  return (
    <SelectDropdown
      data={translatedData}
      onSelect={(selectedItem, index) => {
        const originalItem = data[index];
        onSelectItem(originalItem, index);
      }}
      renderButton={(selectedItem) => {
        return (
          <View style={styleButton}>
            <Text>{selectedItem || name}</Text>
            <Image
              style={styleArrow}
              source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowDown.png")}
            />
          </View>
        );
      }}
      renderItem={(item) => {
        return (
          <View style={styleItem}>
            <View>
              <Text>{item}</Text>
            </View>
            <View style={styles.Line}></View>
          </View>
        );
      }}
    ></SelectDropdown>
  );
}

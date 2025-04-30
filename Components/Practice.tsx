import SelectDropdown from "react-native-select-dropdown";
import { View, Text, Image } from "react-native";
import styles from "../Screens/Stylesheet";
import { useTranslation } from "react-i18next";
import { styleText } from "util";
interface dropdown {
  data: Array<string>;
  name: string;
  styleButton: object;
  styleItem: object;
  styleArrow: object;
  styleText?: object;

  onSelectItem: (selectedItem: string, index: number) => void;
}
export default function CustomD({
  name,
  data,
  styleButton,
  styleItem,
  styleArrow,
  styleText,
  onSelectItem,
}: dropdown) {
  const { t } = useTranslation();
  const translatedData = data.map((item) => t(item));
  return (
    <SelectDropdown
      data={translatedData}
      dropdownStyle={{height: 'auto', borderRadius: 20,
        overflow: 'hidden', // Prevent overflow if the dropdown is too large
        zIndex: 10,
      //  backgroundColor:"red"
       }}
      onSelect={(selectedItem, index) => {
        const originalItem = data[index];
        onSelectItem(originalItem, index);
      }}
      renderButton={(selectedItem) => {
        return (
          <View style={styleButton}>
            <Text style={styleText}>{selectedItem || name}</Text>
            <Image style={styleArrow} source={require("../assets/arrowDown.png")} />
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      renderItem={(item) => {
        return (
          <View style={[styleItem,{}]}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ paddingLeft: 20 }}>{item}</Text>
            </View>
            <View>
              <View style={styles.Line}></View>
            </View>
          </View>
        );
      }}
    ></SelectDropdown>
  );
}

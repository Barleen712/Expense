import SelectDropdown from "react-native-select-dropdown";
import { View, Text, Image } from "react-native";
import styles from "../Screens/Stylesheet";
interface dropdown {
  data: Array<string>;
  name: string;
  styleButton: object;
  styleItem: object;
  styleArrow: object;
}
export default function CustomD({ name, data, styleButton, styleItem, styleArrow }: dropdown) {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => {
        console.log(selectedItem, index);
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

import React, { useState, forwardRef, useContext } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
interface InputProps {
  title: string;
  color: string;
  css: object;
  isPass?: boolean;
  name?: string;
  onchange?: (text: string) => void;
  handleFocus?: () => void;
  limit?: number;
}
const Input = forwardRef<TextInput, InputProps>(
  ({ title, color, css, isPass, name, onchange, handleFocus, limit }: InputProps, ref) => {
    const [Visible, setVisible] = useState(isPass);
    const { colors } = useContext(ThemeContext) as ThemeContextType;
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <TextInput
          ref={ref}
          placeholder={title}
          placeholderTextColor={color}
          style={css}
          secureTextEntry={Visible}
          value={name}
          onChangeText={onchange}
          onFocus={handleFocus}
          maxLength={limit}
        />
        {isPass && (
          <TouchableOpacity
            style={styles.icon}
            activeOpacity={1}
            onPress={() => {
              setVisible(!Visible);
            }}
          >
            <Ionicons name={Visible ? "eye-off" : "eye"} size={25} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default Input;
const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    right: "10%",
    top: "35%",
    zIndex: 1,
  },
});

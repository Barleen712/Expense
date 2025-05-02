import React, { useState, forwardRef } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
interface InputProps {
  title: string;
  color: string;
  css: object;
  isPass?: boolean;
  name?: string;
  onchange?: (text: string) => void;
  handleFocus?: () => void;
}
const Input = forwardRef<TextInput, InputProps>(
  ({ title, color, css, isPass, name, onchange, handleFocus }: InputProps, ref) => {
    const [Visible, setVisible] = useState(isPass);

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
        />
        {isPass && (
          <TouchableOpacity style={styles.icon} onPress={() => setVisible(!Visible)}>
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
  },
});

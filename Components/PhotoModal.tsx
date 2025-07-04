import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { getStyles } from "./Modal/styles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";

interface PropPhoto {
  showModal: boolean;
  setshowModal: (a: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  disable: boolean;
}

export default function PhotoModal({ showModal, setshowModal, onEdit, onDelete, disable }: PropPhoto) {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);

  return (
    <Modal animationType="slide" transparent visible={showModal} onRequestClose={() => setshowModal(false)}>
      <Pressable style={styles.modalOverlay} onPress={() => setshowModal(false)}>
        <Pressable style={styles.photoContainer} onPress={() => {}}>
          <Text style={styles.profilePhotoText}>Profile Photo</Text>
          <View style={styles.photobuttons}>
            <TouchableOpacity style={styles.button} onPress={onEdit}>
              <FontAwesome6 name="edit" size={20} color={"rgb(56, 88, 85)"} />
              <Text style={styles.buttonText}>Edit Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: disable ? "gray" : "rgba(255, 255, 255, 0.71)" }]}
              onPress={onDelete}
              disabled={disable}
            >
              <MaterialIcons name="delete-outline" size={24} color={"rgb(56, 88, 85)"} />
              <Text style={styles.buttonText}>Delete Photo</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

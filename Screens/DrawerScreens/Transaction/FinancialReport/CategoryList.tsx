import React from "react";
import { View, FlatList, Dimensions, Text } from "react-native";
import styles from "../../../Stylesheet";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-native-paper";
import { CATEGORY_COLORS } from "../../../Constants";
const width = Dimensions.get("window").width;

interface CategoryItem {
  category: string;
  total: number;
}

interface CategoryListProps {
  category: CategoryItem[];
}

export default function CategoryList({ category }: CategoryListProps) {
  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      style={{ width: "90%", flex: 6 }}
      data={category}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ margin: 10 }}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0.5,
              padding: 5,
              borderRadius: 15,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "rgba(241, 241, 250, 1)",
              borderColor: "grey",
              alignSelf: "flex-start",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                backgroundColor: CATEGORY_COLORS[item.category],
                width: 12,
                height: 12,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                paddingLeft: 5,
                flexShrink: 1,
              }}
            >
              {item.category}
            </Text>
          </View>

          <ProgressBar
            progress={item.total / 100}
            color={CATEGORY_COLORS[item.category]}
            fillStyle={{
              borderRadius: 20,
            }}
            style={{
              backgroundColor: "rgba(214, 224, 220, 0.24)",
              width: width - 40,
              height: 15,
              borderRadius: 20,
              marginTop: 10,
            }}
          />
        </View>
      )}
    />
  );
}

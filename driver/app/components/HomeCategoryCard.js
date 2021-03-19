import React, { Component } from "react";
import { Card } from "native-base";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Assets from "../assets";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";

export default class HomeCategoryCard extends Component {
  render() {
    categoryObjModel = this.props.categoryObjModel.item;

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          this.props.onPress(categoryObjModel);
        }}
      >
        <View style={{ flex: 1, margin: 5, height: 110, width: 180 }}>
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute"
            }}
          >
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%"
              }}
            >
              <View style={{ flex: 1 }} />
              <View
                style={{
                  flex: 2,
                  backgroundColor: this.props.isSelected
                    ? EDColors.primary
                    : "#fff",
                  borderRadius: 5,
                  alignItems: "center"
                }}
              >
                <View style={{ flex: 1 }} />
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "center",
                    color: this.props.isSelected ? "#fff" : "black",
                    fontSize: 14,
                    fontFamily: ETFonts.regular,
                    marginBottom: 3
                  }}
                >
                  {categoryObjModel.name}
                </Text>
              </View>
            </View>
            <Image
              source={{ uri: categoryObjModel.image }}
              style={{
                width: "90%",
                height: 85,
                borderRadius: 5,
                alignSelf: "center"
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

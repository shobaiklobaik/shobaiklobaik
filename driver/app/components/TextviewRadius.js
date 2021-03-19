import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class TextviewRadius extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={style.text}>{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    backgroundColor: EDColors.primary,
    borderRadius: 4,
    margin: 10,
    alignSelf: "flex-start"
  },
  text: {
    fontFamily: ETFonts.regular,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
    fontSize: 15
  }
});

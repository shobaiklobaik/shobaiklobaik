import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class ETextViewNormalLable extends React.Component {
  render() {
    return <Text style={stylesLable.textLable}>{this.props.text}</Text>;
  }
}
const stylesLable = StyleSheet.create({
  textLable: {
    marginStart: 10,
    marginEnd: 10,
    color: "#000",
    fontSize: 16,
    marginTop: 8,
    marginLeft: 20,
    fontFamily: ETFonts.bold
  }
});

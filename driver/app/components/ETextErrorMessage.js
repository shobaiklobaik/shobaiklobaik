import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class ETextErrorMessage extends React.Component {
  render() {
    return <Text style={[stylesLable.textLable,this.props.errorStyle]}>{this.props.errorMsg}</Text>;
  }
}
const stylesLable = StyleSheet.create({
  textLable: {
    color: "red", fontFamily: ETFonts.regular
  }
});

import React from "react";
import { View, Text, Animated, Image, StyleSheet } from "react-native";
import { Style } from "../stylesheet/StylesUtil";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class EDTextViewNormal extends React.Component {
  render() {
    return <Text style={[styles.textview, this.props.style]}>{this.props.text}</Text>;
  }
}

export const styles = StyleSheet.create({
  textview: {
    color: EDColors.black,
    fontSize: 14,
    marginTop: 5,
    fontFamily: ETFonts.light
  }
})

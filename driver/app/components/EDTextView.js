import React from "react";
import { View, Text, Animated, StyleSheet, Image } from "react-native";
import { Style } from "../stylesheet/StylesUtil";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class EDTextView extends React.Component {
  render() {
    return <Text style={style.textview}>{this.props.text}</Text>;
  }
}

export const style = StyleSheet.create({
  loginBlankView: { flex: 4 },
  loginView: {
    color: "#fff",
    marginLeft: 25,
    marginRight: 25
  },
  textview: {
    color: EDColors.primary,
    fontSize: 15,
    marginTop: 10,
    fontFamily: ETFonts.regular
  },
  textviewNormal: {
    color: "#000",
    fontSize: 18,
    marginTop: 8,
    fontFamily: ETFonts.regular
  }
});

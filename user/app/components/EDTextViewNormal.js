import React from "react";
import { View, Text, Animated, Image } from "react-native";
import { Style } from "../stylesheet/StylesUtil";

export default class EDTextViewNormal extends React.Component {
  render() {
    return <Text style={Style.textview}>{this.props.text}</Text>;
  }
}

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";
import { Messages } from "../utils/Messages";

export default class DataNotAvailableContainer extends React.Component {
  render() {
    return (
      <Text style={stylesLable.textLable}>
        {this.props.text != undefined ? this.props.text : Messages.noDataFound}
      </Text>
    );
  }
}
const stylesLable = StyleSheet.create({
  textLable: {
    color: EDColors.primary,
    fontSize: 16,
    marginTop: 8,
    marginLeft: 16,
    fontFamily: ETFonts.bold
  }
});

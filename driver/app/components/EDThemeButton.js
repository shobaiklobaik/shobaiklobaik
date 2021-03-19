import React, { Component } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";
import EDRTLView from "./EDRTLView";
export default class EDThemeButton extends Component {
  buttonWidth = this.props.buttonWidth || 240;
  fontSizeNew = this.props.fontSizeNew || 16;
  buttonHeight = this.props.buttonHeight || 45;
  render() {
    return (
      <TouchableOpacity
        // pointerEvents={this.props.isDisable ? "none" : ""}
        // style={[
          
        //   this.props.borderButton
        //     ? stylesButton.themeButtonBorder
        //     : stylesButton.themeButton,
        //   {
        //     width: this.buttonWidth,
        //     // fontSize: this.fontSizeNew,
        //     height: this.buttonHeight
        //   },this.props.style || {}
        // ]}
        style={[
          stylesButton.themeButton,
          { borderRadius: this.props.isRadius ? 6 : 0 },
          this.props.style
        ]}
        activeOpacity = {this.props.activeOpacity}
        onPress={this.props.onPress}
      >
        <EDRTLView style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={
            [stylesButton.themeButtonText, this.props.textStyle]
              
          }
        >
          {this.props.label.toUpperCase()}
        </Text>
        </EDRTLView>
      </TouchableOpacity>
    );
  }
}
const stylesButton = StyleSheet.create({
  themeButton: {
    borderRadius: 5,
    backgroundColor: EDColors.primary,
    justifyContent: "center"
  },
  // themeButton: {
  //   paddingTop: 13,
  //   paddingBottom: 10,
  //   backgroundColor: EDColors.primary,
  //   borderRadius: 5
  // },
  themeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: ETFonts.bold,
    fontSize: 16
  },
  themeButtonBorder: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: EDColors.white,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: EDColors.primary
  },
  themeButtonTextBorder: {
    color: EDColors.black,
    textAlign: "center",
    fontFamily: ETFonts.regular,
    fontSize: hp("1.2%")
  }
});

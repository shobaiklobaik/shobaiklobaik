import React, {Component} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {EDColors} from '../assets/Colors';
import {ETFonts} from '../assets/FontConstants';
import metrics from '../utils/metrics';
export default class EDThemeButton extends Component {
  // buttonWidth = this.props.buttonWidth || metrics.screenWidth / ;
  buttonWidth = this.props.buttonWidth || 240;
  fontSizeNew = this.props.fontSizeNew || 16;
  buttonHeight = this.props.buttonHeight || 40;
  render() {
    return (
      <TouchableOpacity
        pointerEvents={this.props.isDisable ? 'none' : ''}
        style={[
          this.props.style || {},
          this.props.borderButton
            ? stylesButton.themeButtonBorder
            : stylesButton.themeButton,
          {
            width: this.buttonWidth,
            fontSize: this.fontSizeNew,
            height: this.buttonHeight,
          },
        ]}
        onPress={this.props.onPress}>
        <Text
          style={
            this.props.borderButton
              ? stylesButton.themeButtonTextBorder
              : stylesButton.themeButtonText
          }>
          {this.props.label}
        </Text>
      </TouchableOpacity>
    );
  }
}
const stylesButton = StyleSheet.create({
  themeButton: {
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 5,
  },
  themeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: ETFonts.regular,
    fontSize: 14,
  },
  themeButtonBorder: {
    padding: 8,
    // paddingBottom: 10,
    backgroundColor: EDColors.white,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: EDColors.primary,
  },
  themeButtonTextBorder: {
    color: EDColors.black,
    textAlign: 'center',
    fontFamily: ETFonts.regular,
    fontSize: 16,
  },
});

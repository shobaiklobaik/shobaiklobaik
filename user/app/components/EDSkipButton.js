import React, { Component } from "react";
import {Text, TouchableOpacity, StyleSheet} from 'react-native'
import {EDColors} from "../assets/Colors"
import { ETFonts } from "../assets/FontConstants";
export default class EDSkipButton extends Component {
    render() {
        return(
            <TouchableOpacity style = {stylesButton.themeButton}
                onPress = {this.props.onPress}
            >
                <Text style = {stylesButton.themeButtonText}>{this.props.label}</Text>
            </TouchableOpacity>
        );
    }
}
const stylesButton = StyleSheet.create({
    themeButton: {
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
        height : 40,
        width : 240,
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 5
      },
      themeButtonText: {
        color: "grey",
        textAlign: "center",
        fontFamily: ETFonts.regular,
        fontSize: 16
      }
})

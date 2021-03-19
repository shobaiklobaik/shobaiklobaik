import React, { Component } from "react";
import { Text} from "react-native";

export default class EDTextButton extends Component {
  render() {
    return(
      <Text style = {this.props.style}
        onPress = {this.props.onPress}
      >
        {this.props.text}
      </Text>
    ); 
  }
}

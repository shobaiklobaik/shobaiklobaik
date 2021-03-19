import React, { Component } from "react";
import {
  StyleSheet,
  Text,Image
} from "react-native";
import { isRTLCheck } from "../utils/Constants";
import { View } from "native-base";
import Assets from "../assets";

export default class EDText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style = {{flexDirection:'row'}}>
      <Text
        style={[
          { textAlign: isRTLCheck() ? "right" : "left" },
          this.props.style
        ]}
        numberOfLines = {this.props.numberOfLines}
      >
        {this.props.label}
        </Text>
        {/* {this.props.mendatory == true ? <Image source = {Assets.mendatory} />
      :null} */}
      </View>
    );
  }
}

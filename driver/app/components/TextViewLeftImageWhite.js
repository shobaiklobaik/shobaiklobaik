import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  AsyncStorage,
  StyleSheet
} from "react-native";
import { ETFonts } from "../assets/FontConstants";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";

export default class TextViewLeftImageWhite extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Image style={style.image} source={this.props.image} />
        <Text style={style.text} numberOfLines={this.props.lines}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 5
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: ETFonts.regular,
    marginLeft: 5,
    color:EDColors.white
  },
  image: {
    width: 20,
    height: 20
  }
});

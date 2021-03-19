import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class RightSearchBox extends React.PureComponent {
  render() {
    return (
      // <View style={style.container}>
      //   <TextInput
      //     style={style.inputText}
      //     placeholder={this.props.placeholder}
      //     onChangeText={text => {
      //       this.props.onChangeText(text);
      //     }}
      //   />
      //   <TouchableOpacity
      //     style={style.search}
      //     activeOpacity={1.0}
      //     onPress={() => {
      //       this.props.onSearchClick();
      //     }}
      //   >
      //     <Image source={Assets.recipe_search} />
      //   </TouchableOpacity>
      // </View>


      <View style={style.container}>
        <TextInput
          style={style.inputText}
          placeholder={this.props.placeholder}
          onChangeText={text => {
            this.props.onChangeText(text);
          }}
        />
        <TouchableOpacity
          style={style.search}
          activeOpacity={1.0}
          onPress={() => {
            this.props.onSearchClick();
          }}
        >
          <Image style={{ alignSelf: "center" }} source={Assets.recipe_search} />
        </TouchableOpacity>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flexDirection: "row", margin: 10, borderRadius: 6, shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "#fff"
  },
  inputText: {
    padding: 8, flex: 1,
    fontSize: 16,
    fontFamily: ETFonts.regular
  },
  search: {
    padding: 10, backgroundColor: EDColors.primary, borderTopRightRadius: 6,
    borderBottomRightRadius: 6

  }
});

// shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 1

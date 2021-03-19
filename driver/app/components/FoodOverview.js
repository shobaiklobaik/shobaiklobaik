import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { ETFonts } from "../assets/FontConstants";
import Assets from "../assets";

export default class FoodOverview extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onClick();
        }}
      >
        <View style={style.container}>
          <Image
            style={style.sideImage}
            source={
              this.props.imageUrl != ""
                ? { uri: this.props.imageUrl }
                : Assets.header_placeholder
            }
          />
          <View style={style.subContainer}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: this.props.is_veg == "1" ? "#239957" : "#A52A2A",
                  alignSelf: "center"
                }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    margin: 2,
                    borderRadius: 6,
                    backgroundColor:
                      this.props.is_veg == "1" ? "#239957" : "#A52A2A"
                  }}
                />
              </View>
              <Text style={style.title}>{this.props.title}</Text>
            </View>
            <Text numberOfLines={2} style={style.desc}>
              {this.props.desc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    margin: 10,
    alignSelf: "flex-start",
    backgroundColor: "#fff"
  },
  sideImage: {
    flex: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    width: 80,
    height: 100
  },
  subContainer: {
    margin: 10,
    flex: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  },
  searchBox: {
    position: "relative",
    marginTop: -30
  },
  title: {
    fontFamily: ETFonts.black,
    fontSize: 15,
    color: "#000",
    marginLeft: 5
  },
  desc: {
    fontFamily: ETFonts.regular,
    fontSize: 12,
    marginTop: 10
  }
});

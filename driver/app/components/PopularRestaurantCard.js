import React, { Component } from "react";
import { Card } from "native-base";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Assets from "../assets";
// import { Rating } from "react-native-elements";
import { Rating } from "react-native-ratings";
import { ETFonts } from "../assets/FontConstants";
import { capitalize } from "../utils/Constants";

export default class PopularRestaurantCard extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    this.setState({ restObjModel: props.restObjModel.item });
  }

  state = {
    restObjModel: this.props.restObjModel.item
  };

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          this.props.onPress(this.state.restObjModel);
        }}
      >
        <View style={{ margin: 5 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 5
            }}
          >
            <Image
              source={
                this.state.restObjModel.image != "" &&
                this.state.restObjModel.image != null &&
                this.state.restObjModel.image != undefined
                  ? { uri: this.state.restObjModel.image }
                  : Assets.header_placeholder
              }
              style={{
                width: "95%",
                height: 100,
                marginTop: 5,
                borderRadius: 5,
                alignSelf: "center"
              }}
            />
            <View style={{ marginLeft: 5, marginRight: 5,marginTop:5 }}>
              <Text
                style={{
                  fontFamily: ETFonts.bold
                }}
              >
                {this.state.restObjModel.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  alignContent: "center"
                }}
              >
                <Image source={Assets.ic_location_grey} />
                <Text
                  numberOfLines={1}
                  style={{
                    marginRight: 10,
                    fontSize: 12,
                    marginLeft:3,
                    fontFamily: ETFonts.regular
                  }}
                >
                  {this.state.restObjModel.address}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", marginTop: 5, marginBottom: 10 }}
              >
                <Rating
                  imageSize={15}
                  readonly={true}
                  startingValue={
                    this.state.restObjModel.rating != null &&
                    this.state.restObjModel.rating > 0
                      ? parseFloat(this.state.restObjModel.rating)
                      : 0
                  }
                  style={{ flex: 1 }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    alignContent: "flex-end",
                    marginLeft: 5,
                    fontSize: 12,
                    fontFamily: ETFonts.regular
                  }}
                >
                  {capitalize(this.state.restObjModel.timings.off) +
                    " " +
                    capitalize(this.state.restObjModel.timings.open)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

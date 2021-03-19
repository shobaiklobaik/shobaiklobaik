import React from "react";
import { View, Text, Image, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { ETFonts } from "../assets/FontConstants";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";
import MyWebView from "react-native-webview";
import { INR_SIGN } from "../utils/Constants";

export default class PackageContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.fontSize = Platform.OS == "ios" ? "18px" : "18px";
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
    // this.customStyle =
    //   "<style>* {max-width: 100%;} body {font-size: 15px;}</style>";

    this.customStyle =
      this.meta +
      "<style>* {max-width: 100%;} body {font-size:" +
      this.fontSize +
      ";}</style>";
  }

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          this.props.onPress(this.props.pos);
        }}
      >
        <View
          style={
            this.props.isSelected ? style.containerSelected : style.container
          }
        >
          <View style={style.detail}>
            <Text style={style.detailName}>
              {this.props.pkgName + "- " + INR_SIGN + " " + this.props.price}
            </Text>

            <MyWebView
              source={{ html: this.customStyle + this.props.pkgDesc }}
              startInLoadingState={true}
              style={{
                flex: 1,
                alignSelf: "flex-start",
                width: "100%"
              }}
              hasIframe={true}
              scrollEnabled={false}
            />
            <Text style={{ margin: 5 }}>
              {"Availability - " + this.props.pkgAvailable}
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
    backgroundColor: "#fff",
    margin: 5,
    alignSelf: "center"
  },
  containerSelected: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 5,
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: EDColors.primary
  },
  image: {
    width: 80
  },
  detail: {
    flex: 4,
    marginLeft: 5,
    alignSelf: "center"
  },
  detailName: {
    color: "#000",
    fontSize: 16,
    fontFamily: ETFonts.bold,
    marginTop: 5
  },
  packageDesc: {
    marginTop: 2,
    marginBottom: 2,
    fontFamily: ETFonts.regular
  }
});

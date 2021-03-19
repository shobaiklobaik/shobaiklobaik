"use strict";

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  StatusBar
} from "react-native";
import Metrics from "../utils/metrics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP
} from "react-native-responsive-screen";
import { strings, isRTL } from "../locales/i18n";
import EDRTLImage from "./EDRTLImage";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";
import EDRTLView from "./EDRTLView";


export default class NavBar extends Component {
  render() {
    return (
      <View
        style={{
          height: hp("10%"),
          backgroundColor: this.props.primaryColor
        }}
      >
        <StatusBar
          barStyle="light-content"
          // backgroundColor="rgba(158,194,42,1.0)"
          backgroundColor={this.props.primaryColor}
        />
        {/* LEFT BUTTONS */}
        <EDRTLView style={{ paddingTop: Platform.OS == "ios" ? 20 : 0, flex: 1 }}>
          <EDRTLView style={{ flex: 2 }}>
            {this.props.left && this.props.ishidden === true ? (
              <EDRTLView style={{ marginLeft: 10, alignItems: "center" }}>
                {this.props.isLeftString ? (
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: ETFonts.regular,
                      color: EDColors.white,
                      fontSize: heightPercentageToDP("1.7%")
                    }}
                  >
                    {this.props.left}
                  </Text>
                ) : (
                  <TouchableOpacity style={{}} onPress={this.props.onLeft}>
                    <EDRTLImage
                      source={this.props.left}
                      style={styles.leftImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </EDRTLView>
            ) : <EDRTLView
              style={{ marginLeft: 10, alignItems: "center" }}
            >
                {this.props.isLeftString ? <Text style={{ flex: 1, fontFamily: ETFonts.regular, color: EDColors.white, fontSize: heightPercentageToDP("1.7%") }}>{this.props.left}</Text> : <TouchableOpacity style={{padding:20}} onPress={this.props.onLeft}>
                  <EDRTLImage
                    source={this.props.left}
                    style={{}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>}
              </EDRTLView>}
          </EDRTLView>

          {/* TITLE */}
          <View
            style={{ flex: 6, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontFamily: ETFonts.bold,
                fontSize: heightPercentageToDP("2.4%"),
                color: EDColors.white,
                textAlign: 'center'
              }}
            >
              {this.props.title}
            </Text>
          </View>

          {/* RIGHT BUTTONS */}
          <EDRTLView style={{ flex: 2 }}>
            {this.props.right && this.props.ishidden ? (
              <EDRTLView
                style={{
                  justifyContent: "flex-end",
                  flex: 1,
                  marginRight: 10,
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.props.onRight}>
                      <Image
                        source={this.props.right}
                        style={styles.leftImage}
                        resizeMode="contain"
                      />
                  />
                </TouchableOpacity>
              </EDRTLView>
            ) : <EDRTLView
              style={{
                justifyContent: "flex-end",
                flex: 1,
                marginRight: 10,
                alignItems: "center"
              }}
            >
                <TouchableOpacity
                  
                  onPress={this.props.onRight}
                >
                  <Image
                    source={this.props.right}
                    style={[]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </EDRTLView>
            }
          </EDRTLView>
        </EDRTLView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topbar: {
    width: "100%",
    flex: 0,
    height: Metrics.navbarHeight + Metrics.statusbarHeight
  },
  navbar: {
    backgroundColor: EDColors.secondary,
    flex: 0,
    width: "100%",
    height: Metrics.navbarHeight,
    borderBottomColor: EDColors.primary,
    marginTop: Metrics.statusbarHeight + 10,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  left: {
    color: EDColors.primary,
    height: 23,
    width: 23,
    resizeMode: "stretch"
  },
  leftImage: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20
  }
});

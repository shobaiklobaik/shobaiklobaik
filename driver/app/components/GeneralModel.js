import React, { Component } from "react";
import { StyleSheet, Modal, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";
import { strings } from "../locales/i18n";
import EDRTLView from "./EDRTLView";
import EDThemeButton from "./EDThemeButton";
import Metrics from "../utils/metrics";
import { isRTLCheck } from "../utils/Constants";
import EDTextInput from "./EDTextInput";
import metrics from "../utils/metrics";
import EDText from "./EDText";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Rating, AirbnbRating } from 'react-native-ratings';
import StarRating from 'react-native-star-rating';
import Assets from "../assets";

export default class GeneralModel extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isVisible: this.props.isVisible,
    starCount: 0
  };

  componentWillReceiveProps(props) {
    this.setState({ isVisible: props.isVisible });
  }

  onStarRatingPress(rating) {
    console.log("Star count is :::::: ", rating)
    this.props.starCount(rating)
    this.setState({
      starCount: rating
    });
  }


  render() {
    return (
      <Modal
        visible={this.state.isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.props.onNoClick("No Click");
        }}
      >
        <View style={style.modalContainer}>
          <View style={style.modalSubContainer}>
            {/* <View>
              {this.props.isNoHide ? (<View>) : null }
            </View> */}
            <View style = {{width: metrics.screenWidth * 0.72}}>
              {this.props.isNoHide ? <TouchableOpacity
              onPress={() => {
                this.setState({ isVisible: false }, () => {
                  this.props.onNoClick("No Click");
                });
              }}
              >
                <Image
                style = {{width: metrics.screenWidth * 0.042, height: metrics.screenWidth * 0.042, marginHorizontal:10, alignSelf: isRTLCheck() ? "flex-start" : 'flex-end' }}
                source = {Assets.cancel}
                />
                 </TouchableOpacity> : null}
            </View>

            <EDText
              style={{ fontSize: hp("3.0%"), fontFamily: ETFonts.satisfy, color: EDColors.primary }}
              label={this.props.label}
            />
          {this.props.isRating ? 
            <StarRating
              // containerStyle = {{height: metrics.screenHeight * 0.021, borderWidth:1}}
              // buttonStyle ={{height: 20, width: 20, borderWidth:1}}
              // starStyle = {{width:10, height:10}}
              starSize={metrics.screenWidth * 0.042}
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={EDColors.primary}
            />
            : null}
            <TextInput
              placeholder={this.props.placeholder}
              value={this.props.value}
              multiline={this.props.multiline}
              numberOfLines={this.props.numberOfLines}
              onChangeText={this.props.onChangeText}
              style={[{textAlign: isRTLCheck() ? 'right' : 'left'},this.props.style]}
            />
            <EDRTLView style={style.optionContainer}>

              <EDThemeButton
                style={[{
                  height: metrics.screenHeight * 0.056,
                  width: Metrics.screenWidth * 0.4,
                  // borderRadius: 10,
                  overflow: "hidden",
                  marginTop: metrics.screenHeight * 0.015,
                  // marginRight: isRTLCheck() ? 10 : 0,
                  // marginLeft: isRTLCheck() ? 0 : 10,
                }, this.props.buttonstyle]}
                label={this.props.YesTitle || strings("dialog.yes")}
                colors={this.props.colors}
                activeOpacity = {this.props.activeOpacity}
                onPress={() => {
                  this.setState({ isVisible: true }, 
                    () => {
                    this.props.onYesClick("Yes Click");
                  }
                  );
                }}
              />

            </EDRTLView>
          </View>
        </View>
      </Modal>
    );
  }
}

export const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: metrics.screenHeight * 0.015,
    width: metrics.screenWidth * 0.72,
    height: metrics.screenHeight * 0.37,
    // marginLeft: 20,
    // marginRight: 20,
    borderRadius: 6,
    // marginTop: 20,
    // marginBottom: 20,
    alignItems: "center",
    alignSelf: 'center',
    // borderWidth: 1
  },
  optionContainer: {
    justifyContent: "center",
    alignItems: 'center',
    // marginTop: 20,
    // borderWidth: 1
  },
  deleteOption: {
    fontFamily: ETFonts.bold,
    fontSize: 12,
    color: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 5,
    backgroundColor: EDColors.primary
  }
});

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  Platform
} from "react-native";

import { EDColors } from "../assets/Colors";
import { EDFonts, ETFonts } from "../assets/FontConstants";
import { TextFieldTypes, isRTLCheck, COUNTRY_CODE } from "../utils/Constants";
import EDRTLView from "./EDRTLView";
import { isRTL, strings } from "../locales/i18n";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Metrics from "../utils/metrics";
import metrics from "../utils/metrics";
import EDText from '../components/EDText';

export default class extends Component {

  constructor(props) {
    super(props);
    this.secondTextInputRef = React.createRef()
  }

  state = {
    value: this.props.value,
    isVisible: false
  }

  componentWillReceiveProps(props) {
    this.props = props
    this.setState({ value: props.value })
  }

  firstText = () => {
    // this.setState({isVisible: true})
    this.secondTextInputRef = React.createRef();
  }

  render() {
    return (
      <View
        style={[
          this.props.style,
          {
            // marginHorizontal: 20,
            backgroundColor: EDColors.white,
            // marginVertical: 10,
            borderColor: EDColors.border,
            // borderRadius: 10,
            // borderBottomWidth: 0.5,
          }
        ]}
        pointerEvents={this.props.isDisable ? "none" : "auto"}
      >
        <EDRTLView
          style={{
            alignItems: "center",
            backgroundColor: "rgba(244,243,244,1.0)",
            // width: Metrics.screenWidth * 0.92,
          }}
        >
          <Image style={[styles.image, { tintColor: this.props.tintColor }]} source={this.props.source} />
          <EDRTLView style={{ flex: 1, alignItems:'center' }}>
            {this.props.hidden ? null : (
              <EDText
                style={{
                  // flex:1,
                  // textAlign: isRTLCheck() ? "right" : "left",
                  fontSize: hp("2.0%"),
                  color: "rgba(144,144,144,1.0)"
                }}
                label = {this.props.TitleText}
              />
              
            )}

            {this.props.isInput ? (
              <TouchableOpacity style = {{justifyContent: 'center'}}>
              <EDText
                style={{
                  textAlign: isRTLCheck() ? "right" : "left",
                  fontSize: hp("2.0%"),
                }}
                label= {this.props.default}
              />
              
              </TouchableOpacity>
            ) : (
                <TextInput
                  editable={this.props.isEditable}
                  value={this.state.value}
                  ref={(input) => { this.secondTextInput = input; }}
                  style={{
                    textAlign: isRTLCheck() ? "right" : "left",
                    fontSize: hp("2.0%"),
                    padding: 0
                  }}
                  onChangeText={(newValue) => {
                    this.props.onChangeText(newValue)
                  }}
                />
              )}
          </EDRTLView>
          {this.props.isButton ? null
          // (
          //   <TouchableOpacity
          //     onPress={this.props.onPress}
          //   >
          //     <Text
          //       style={{
          //         color: this.props.primaryColor,
          //         width: 40,
          //         height: 20,
          //         marginRight: 5,
          //         marginLeft: 15
          //       }}
          //     >
          //       {strings('Profile.view')}
          //     </Text>
          //   </TouchableOpacity>
          // ) 
          : (
              <TouchableOpacity onPress={() => {
                this.secondTextInput.focus()
              }}
                activeOpacity={1.0}
              >
                <Image style={[styles.image, {}]} source={this.props.sourceImage} />
              </TouchableOpacity>
            )}
        </EDRTLView>
        {this.props.error ? (
          <EDRTLView style={{}}>
            <Text style={styles.errorTextStyle}>{this.props.error}</Text>
          </EDRTLView>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorTextStyle: {
    fontSize: hp("1.7%"),
    fontFamily: ETFonts.regular,
    color: EDColors.error
  },
  image: {
    width: metrics.screenWidth * 0.04,
    height: metrics.screenWidth * 0.04,
    margin: metrics.screenWidth * 0.04,
  }
});

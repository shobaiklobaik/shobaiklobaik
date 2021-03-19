import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { EDColors } from "../assets/Colors";
import { isRTLCheck } from "../utils/Constants";
import EDRTLView from "./EDRTLView";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ETFonts } from "../assets/FontConstants";
import { TextFieldTypes } from "../utils/TextFieldTypes";
import Assets from "../assets";

export default class EditText extends React.Component {

  constructor(props) {
    super(props);

  }

  state = {
    showPassword: false
  };

  fieldKeyboardType() {
    if (this.props.type === TextFieldTypes.email) {
      return "email-address";
    } else if (this.props.type === TextFieldTypes.password) {
      return "default";
    } else if (
      this.props.type === TextFieldTypes.amount ||
      this.props.type === TextFieldTypes.phone
    ) {
      return "number-pad";
    } else if (this.props.type === TextFieldTypes.description) {
      return "default";
    }
  }

  shouldAutoCapitalise() {
    if (this.props.type === TextFieldTypes.email) {
      return "none";
    } else if (this.props.type === TextFieldTypes.password) {
      return "none";
    }
  }

  showHidePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    return (
      <View style={[this.props.styleview, {
        backgroundColor: EDColors.white,
        marginTop: 10
        // marginVertical: 5,
        // borderColor: EDColors.border,
        // borderBottomWidth: 0.5
      }]}
        pointerEvents={this.props.isDisable ? "none" : "auto"}>
        <EDRTLView style={[style.editText, { alignItems: 'center' }]}>
          {/* {this.props.isCode ? 
        <View style={{ justifyContent: 'center',marginHorizontal:5 }}>
            <Text style={{ alignSelf: 'center' }}>
              {this.props.codeLabel}
            </Text>
          </View>
          : null} */}
          <TextInput
            style={[{ textAlign: (isRTLCheck() ? 'right' : 'left'), paddingVertical: 10, flex: 1 }, this.props.style] || {}}
            keyboardType={this.fieldKeyboardType()}
            autoCapitalize={this.shouldAutoCapitalise()}
            secureTextEntry={this.props.type == TextFieldTypes.password && !this.state.showPassword}
            maxLength={
              this.props.maxLength != undefined ? this.props.maxLength : 30
            }
            multiline={
              this.props.multiline != undefined ? this.props.multiline : false
            }
            onChangeText={userText => {
              if (this.props.onChangeText != undefined) {
                this.props.onChangeText(userText);
              }
            }}

            value={this.props.value}
            placeholder={this.props.hint}
            returnKeyType="done"
          />

          {this.props.type == TextFieldTypes.password ? (
            <TouchableOpacity
              style={{ marginHorizontal: 10, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
              onPress={this.showHidePassword}
            >
              <Image
                style={{ height: 20, width: 20 }}
                resizeMode={'contain'}
                source={
                  this.state.showPassword
                    ? Assets.open_eye
                    : Assets.close_eye
                }
              />
            </TouchableOpacity>
          ) : null}
        </EDRTLView>
        <View style={{ borderColor: EDColors.primary, borderWidth: 1 }} />
        {this.props.error
          ? <EDRTLView style={{}}>
            <Text style={style.errorTextStyle}>{this.props.error}</Text>
          </EDRTLView>
          : null}
      </View>
    );
  }
}

export const style = StyleSheet.create({
  editText: {
    // flex:1,
    alignItems: 'center',
    backgroundColor: "#fff",
    // borderBottomColor: EDColors.white,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    // borderBottomWidth: 2,
    fontFamily: ETFonts.light,
    // marginTop: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5
    // boxshadow: 10 5 5 black;
  },
  textFieldStyle: {
    marginHorizontal: 0,
    flex: 1,
    // height: heightPercentageToDP("3.3%"),
    fontFamily: ETFonts.regular,
    fontSize: hp("2%"),
    color: EDColors.amenities,
    // paddingVertical: 10,
    // height: 35

  },
  errorTextStyle: {
    fontSize: hp("1.7%"),
    fontFamily: ETFonts.regular,
    color: EDColors.error,
  }
});

import React from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import metrics from '../utils/metrics';
import Assets from '../assets';
// import EDRTLView from "./EDRTLView";
import {ETFonts} from '../assets/FontConstants';
import FastImage from 'react-native-fast-image';

export default class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.secondTextInputRef = React.createRef();
  }

  firstText = () => {
    this.secondTextInputRef = React.createRef();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: this.props.isText ? 10 : 0,
          marginBottom: this.props.isText ? 10 : 0,
          marginTop: 10,
        }}>
        <FastImage
          style={{height: 20, width: 20}}
          resizeMode={'contain'}
          source={this.props.source}
        />

        {this.props.isText ? (
          <Text
            style={{
              fontSize: 16,
              fontFamily: ETFonts.regular,
              flex: 1,
              marginLeft: 10,
            }}>
            {this.props.text}
          </Text>
        ) : (
          <TextInput
            style={{
              fontSize: 16,
              fontFamily: ETFonts.regular,
              flex: 1,
              marginLeft: 10,
              color: '#000',
            }}
            placeholderTextColor="#C7C7CD"
            ref={input => {
              this.secondTextInput = input;
            }}
            maxLength={40}
            numberOfLines={1}
            autoFocus={this.props.autoFocus}
            placeholder={'Full Name'}
            onChangeText={userText => {
              // this.setState({
              //   firstName: userText
              // });
              this.props.onChangeValue(userText);
            }}>
            {this.props.text}
          </TextInput>
        )}

        {this.props.isHidden ? (
          <TouchableOpacity
            style={{marginEnd: 5}}
            // onPress={() => this.setState({ txtFocus: true })}
            onPress={
              this.props.isTouchable
                ? () => {
                    this.secondTextInput.focus();
                  }
                : this.props.onPress
              // this.secondTextInput.focus()
            }>
            <Image style={{margin: 5}} source={Assets.edit} />
          </TouchableOpacity>
        ) : this.props.isNotification ? (
          <Switch
            style={{marginBottom: 10, marginEnd: 5}}
            value={this.props.value}
            onValueChange={
              value => this.props.onValueChange(value)
              // this.setState({ isNotification: value })
            }
          />
        ) : null}
      </View>
    );
  }
}

import React from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import metrics from '../utils/metrics';
import Assets from '../assets';
// import EDRTLView from "./EDRTLView";
import {ETFonts} from '../assets/FontConstants';
// import { isRTLCheck } from "../utils/Constants";
import FastImage from 'react-native-fast-image';

export default class MyCustomCallout extends React.Component {
  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            width: metrics.screenWidth * 0.483,
          }}>
          <FastImage
            source={this.props.image}
            style={{
              borderRadius: 5,
              overflow: 'hidden',
              width: metrics.screenWidth * 0.1,
              height: metrics.screenWidth * 0.1,
              borderWidth: 1,
            }}
          />
          <View style={{marginHorizontal: 10}}>
            <Text style={{fontFamily: ETFonts.regular}}>
              {this.props.title}
            </Text>
            <Text style={{fontFamily: ETFonts.light}}>
              {this.props.discription}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              // marginBottom: - metrics.screenHeight * 0.025,
              width: 40,
              height: 40,
              marginLeft: metrics.screenWidth * 0.1,
              // zIndex:1000,
              // borderWidth:1
            }}>
            <Image
              style={{width: 40, height: 40}}
              resizeMode="center"
              source={Assets.call_order}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

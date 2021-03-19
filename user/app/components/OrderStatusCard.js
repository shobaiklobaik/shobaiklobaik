import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import metrics from '../utils/metrics';
import FastImage from 'react-native-fast-image';

export default class OrderStatusCard extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',

          width: (metrics.screenWidth - 20) / 7 + 3,
        }}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: ETFonts.regular,
            color: EDColors.primary,
          }}
          numberOfLines={this.props.lines}>
          {this.props.text}
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontFamily: ETFonts.regular,
          }}>
          {this.props.heading}
        </Text>
        <FastImage
          style={{
            width: (metrics.screenWidth - 20) / 7 + 3,
            height: (metrics.screenWidth - 20) / 7 + 3,
            marginTop: 5,
          }}
          source={this.props.image}
        />
      </View>
    );
  }
}

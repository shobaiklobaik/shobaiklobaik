import React from 'react';
import {
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp
// } from "react-native-responsive-screen";
// import EDRTLView from "./EDRTLView";
import {EDColors} from '../assets/Colors';
// import { EDFonts } from "../utils/EDFontConstants";
// import { getIsRTL, isRTLCheck, HOME_URL_DEFAULT } from "../utils/EDConstants";
import Metrics from '../utils/metrics';
import {ETFonts} from '../assets/FontConstants';
import FastImage from 'react-native-fast-image';

export default class DeliveryDetailComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          {flexDirection: 'row', alignItems: 'center'},
          this.props.style,
        ]}>
        <FastImage
          source={this.props.source}
          style={[
            {
              width: Metrics.screenWidth * 0.05,
              height: Metrics.screenWidth * 0.05,
              marginTop: 2,
              // borderWidth:1
            },
            this.props.imageStyle,
          ]}
          resizeMode="cover"
        />
        <Text
          style={[
            {
              fontSize: 15,
              // fontFamily: EDFonts.bold,
              // borderWidth:1,
              marginLeft: 5,
              marginRight: 5,
              fontFamily: ETFonts.light,
              // textAlign: isRTLCheck() ? "right" : "left"
            },
            this.props.textStyle,
          ]}
          onPress={this.props.onPress}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}

import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import Assets from '../assets';
import FastImage from 'react-native-fast-image';

export default class TextViewLeftImage extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Image
          style={style.image}
          source={this.props.image}
          resizeMode="contain"
        />
        <Text style={style.text} numberOfLines={this.props.lines}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: ETFonts.regular,
    marginLeft: 2,
  },
  image: {
    width: 23,
    height: 15,
  },
});

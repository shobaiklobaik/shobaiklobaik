import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import {capiString, INR_SIGN} from '../utils/Constants';
import FastImage from 'react-native-fast-image';

export default class ImageGrid extends React.PureComponent {
  render() {
    return (
      //   <View style={{ flex: 1 }}>
      <View style={style.container}>
        <FastImage style={style.image} source={{uri: this.props.imageUrl}} />
        <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.title}>
          {capiString(this.props.title)}
        </Text>

        <Text style={style.price}>{INR_SIGN + ' ' + this.props.price}</Text>
      </View>
      //   </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    width: 150,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 10,
    alignSelf: 'flex-start',
  },
  image: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  title: {
    flex: 1,
    fontFamily: ETFonts.regular,
    fontSize: 16,
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5,
    color: '#000',
  },
  price: {
    fontFamily: ETFonts.regular,
    marginLeft: 5,
    marginBottom: 10,
  },
});

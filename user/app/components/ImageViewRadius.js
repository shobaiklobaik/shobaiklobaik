import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class ImageViewRadius extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            this.props.onButtonClick();
          }}>
          <FastImage style={style.image} source={{uri: this.props.imageUrl}} />
        </TouchableOpacity>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
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
    borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});

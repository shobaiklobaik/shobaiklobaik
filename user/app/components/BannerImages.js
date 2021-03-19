import React from 'react';
import Carousel from 'react-native-banner-carousel';
import {Dimensions, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180;

export default class BannerImages extends React.PureComponent {
  renderImage(image, index) {
    return (
      <View key={index}>
        <FastImage
          style={{width: BannerWidth, height: BannerHeight}}
          source={{uri: image.image}}
        />
      </View>
    );
  }

  render() {
    loanToDisplay = this.props.loan;
    return (
      <Carousel
        autoplay
        autoplayTimeout={5000}
        loop
        showsPageIndicator={false}
        index={0}
        pageSize={BannerWidth}>
        {this.props.images.map((image, index) =>
          this.renderImage(image, index),
        )}
      </Carousel>
    );
  }
}

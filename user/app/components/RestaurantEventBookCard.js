import React, {Component} from 'react';
import {Card} from 'native-base';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Assets from '../assets';
import {Rating} from 'react-native-elements';
import {EDColors} from '../assets/Colors';
import EDThemeButton from './EDThemeButton';
import {ETFonts} from '../assets/FontConstants';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

export default class RestaurantEventBookCard extends Component {
  constructor(props) {
    super(props);

    this.CheckLanguage();
  }
  state = {
    restObjModel: this.props.restObjModel.item,
  };
  CheckLanguage() {
    getLanguage(
      success => {
        if (success.language == 'arabic') {
          console.log('Sugan', 'arabic language');
          this.state.language = 'arabic';
        } else {
          console.log('Sugan', 'english language');
          this.state.language = 'english';
        }
      },
      failure => {},
    );
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          margin: 5,
          height: 170,
          backgroundColor: 'white',
          borderRadius: 5,
        }}>
        <View style={{height: 120}}>
          {/* <FastImage
            source={{uri: this.state.restObjModel.image}}
            style={{
              height: '100%',
              alignSelf: 'center',
              width: '100%',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          /> */}
          <Image
            source={{uri: this.state.restObjModel.image}}
            style={{
              height: '100%',
              alignSelf: 'center',
              width: '100%',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          />
          {this.state.restObjModel.rating != undefined &&
          this.state.restObjModel.rating != '' ? (
            <View
              style={{
                marginTop: 90,
                flex: 1,
                backgroundColor: EDColors.primary,
                height: 30,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopEndRadius: 5,
                position: 'absolute',
              }}>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Image source={Assets.star_white} style={{}} />
                <Text
                  numberOfLines={1}
                  style={{
                    paddingLeft: 2,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: ETFonts.regular,
                  }}>
                  {this.state.restObjModel.rating}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{flexDirection: 'row', margin: 5}}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: ETFonts.bold,
              }}>
              {this.state.restObjModel.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Assets.ic_location_grey} />
              <Text
                numberOfLines={1}
                style={{fontFamily: ETFonts.regular, fontSize: 14}}>
                {this.state.restObjModel.address}
              </Text>
            </View>
          </View>
          <EDThemeButton
            label={strings('RestaurantEventBookCard.Book')}
            buttonWidth={70}
            fontSizeNew={10}
            onPress={() => {
              this.props.onPress(this.state.restObjModel);
            }}
          />
        </View>
      </View>
    );
  }
}

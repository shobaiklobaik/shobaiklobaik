import React from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import {Rating} from 'react-native-elements';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import {funGetTime, funGetDateStr, funGetTimeStr} from '../utils/Constants';
import TextViewLeftImage from './TextViewLeftImage';
import TextViewLeftImageWhite from './TextViewLeftImageWhite';
import FastImage from 'react-native-fast-image';

export default class BookedEventCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={style.container}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <FastImage style={style.image} source={{uri: this.props.pkgImage}} />

          <View style={style.detail}>
            <Text style={style.detailName}>{this.props.RestaurantName}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                style={{alignSelf: 'center'}}
                source={Assets.ic_location_grey}
              />
              <Text numberOfLines={1} style={{marginLeft: 3, marginRight: 10}}>
                {this.props.address}
              </Text>
            </View>
            <Rating
              imageSize={15}
              readonly={true}
              startingValue={parseFloat(this.props.rating)}
              style={{flex: 1, marginTop: 5}}
            />
            <Text numberOfLines={1} style={style.packageDesc}>
              {this.props.pkgDesc}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.onPress(this.props.pos);
            }}>
            <Text style={style.packageSelection}>
              {this.props.isSelected ? 'X' : null}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 10,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: EDColors.primary,
          }}>
          <TextViewLeftImageWhite
            image={Assets.calender_white}
            text={funGetDateStr(this.props.timing + '')}
            lines={0}
          />
          <TextViewLeftImageWhite
            image={Assets.clock_white}
            text={funGetTimeStr(this.props.timing + '')}
            lines={0}
          />
          <TextViewLeftImageWhite
            image={Assets.people_white}
            text={this.props.people + ' people'}
            lines={0}
          />

          <Text
            style={{
              fontFamily: ETFonts.regular,
              color: '#fff',
              fontSize: 12,
            }}>
            {this.props.buttonText}
          </Text>
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 5,
  },
  image: {
    width: 80,
    height: 80,
    margin: 5,
  },
  detail: {
    flex: 4,
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  detailName: {
    color: '#000',
    fontSize: 16,
    marginTop: 5,
    fontFamily: ETFonts.regular,
  },
  packageDesc: {
    marginTop: 8,
    fontFamily: ETFonts.regular,
  },
  packageSelection: {
    fontFamily: ETFonts.regular,
    color: EDColors.primary,
    padding: 5,
  },
});

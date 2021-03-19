import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import {Rating} from 'react-native-ratings';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import {strings} from '../locales/i18n';
import {INR_SIGN} from '../utils/Constants';
import FastImage from 'react-native-fast-image';

export default class OrderItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={style.container}>
        <View style={style.innerContainer}>
          <FastImage
            style={style.itemImage}
            source={{uri: this.props.itemImage}}
          />
          <View
            style={{
              flex: 4,
              marginTop: 10,
              marginLeft: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: this.props.isVeg == '1' ? '#239957' : '#A52A2A',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    margin: 2,
                    borderRadius: 6,
                    backgroundColor:
                      this.props.isVeg == '1' ? '#239957' : '#A52A2A',
                  }}
                />
              </View>
              <Text style={style.itemName}>{this.props.itemName}</Text>
            </View>
            <Text style={{margin: 2}}>{this.props.quantity}</Text>
            <Text style={style.price}>{this.props.price}</Text>
          </View>
        </View>

        {this.props.noOfAddons > 0 && (
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              padding: 8,
              borderTopWidth: 0.5,
              borderColor: 'lightgray',
              borderRadius: 6,
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
              }}>
              {strings('CartContainer.addons') + ':-'}
            </Text>
            {this.props.addOnsData.addons.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{item.addons_name}</Text>
                  <Text>{INR_SIGN + ' ' + item.price}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
}

export const style = StyleSheet.create({
  // container: {
  //   borderRadius: 6,
  //   backgroundColor: '#fff',
  //   flexDirection: 'row',
  //   alignSelf: 'flex-start',
  //   shadowColor: 'black',
  //   shadowOpacity: 0.4,
  //   shadowOffset: {width: 0, height: 2},
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  container: {
    flex: 1,
    // marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    // overflow: 'hidden',
    shadowColor: 'gray',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 5,
  },
  innerContainer: {
    // margin: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    // shadowColor: 'black',
    // shadowOpacity: 0.26,
    // shadowOffset: {width: 0, height: 2},
    // shadowRadius: 8,
    // elevation: 2,
    // marginBottom: 0.5,
  },
  itemImage: {
    flex: 2,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 3,
    marginTop: 3,
  },
  itemName: {
    fontSize: 18,
    fontFamily: ETFonts.bold,
    color: '#000',
    textAlign: 'left',
    marginLeft: 5,
  },
  qunContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
  },
  roundButton: {
    margin: 2,
    borderRadius: 10,
    backgroundColor: EDColors.primary,
    justifyContent: 'center',
  },
  price: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    fontFamily: ETFonts.regular,
    textAlign: 'right',
    paddingHorizontal: 8,
  },
  deleteContainer: {
    flex: 0.8,
    backgroundColor: EDColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});

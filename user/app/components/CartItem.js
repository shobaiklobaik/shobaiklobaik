import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {ETFonts} from '../assets/FontConstants';
import {Rating} from 'react-native-ratings';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import {strings} from '../locales/i18n';
import FastImage from 'react-native-fast-image';
import {INR_SIGN} from '../utils/Constants';

export default class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    // console.log('props.addonsData', props.cartDataresponse.addonsData);
    this.setState({
      quantity: props.quantity,
      // addonsData: props.cartDataresponse.addonsData,
    });
  }

  state = {
    quantity: this.props.quantity > 0 ? this.props.quantity : 0,
    isRefresh: false,
    // addonsData: [],
  };

  renderViewAddOns() {
    const {cartaddonsData, index} = this.props;
    var data = [];
    cartaddonsData.map((itemdata, index1) => {
      if (index == index1) {
        console.log('index1', index1);
        console.log('item', itemdata);
        itemdata.map((item, index2) => {
          data.push(item);
        });
      }
    });
    var addOnsText = '';
    data.map((item, index) => {
      addOnsText = addOnsText.concat(
        ` ${item.addons_name}: ${INR_SIGN} ${item.price}${
          data.length > 1 ? (data.length == index + 1 ? '' : ',') : ''
        }`,
      );
    });
    console.log('addOnsText', addOnsText);
    if (data.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 8,
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              maxWidth: '25%',
            }}>
            {strings('CartContainer.addons') + ':-'}
          </Text>
          <Text
            style={{
              fontSize: 13,
              flex: 1,
            }}>
            {addOnsText}
          </Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={style.container}>
        <View style={style.innerContainer}>
          <FastImage
            style={style.itemImage}
            source={{uri: this.props.itemImage}}
          />

          <View style={{flex: 4, marginTop: 10, marginLeft: 10}}>
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
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={style.qunContainer}>
                <TouchableOpacity
                  style={style.roundButton}
                  onPress={() => {
                    if (this.state.quantity != 0) {
                      this.setState({quantity: this.state.quantity - 1});
                      this.props.onMinusClick(this.state.quantity - 1);
                    }
                  }}>
                  <Image source={Assets.ic_minus} style={{margin: 5}} />
                </TouchableOpacity>

                <Text style={{margin: 2}}>{this.state.quantity}</Text>

                <TouchableOpacity
                  style={style.roundButton}
                  onPress={() => {
                    if (this.state.quantity >= 0) {
                      this.setState({quantity: this.state.quantity + 1});
                      this.props.onPlusClick(this.state.quantity + 1);
                    }
                  }}>
                  <Image source={Assets.ic_plus} style={{margin: 5}} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={style.price}>{this.props.price}</Text>
          </View>

          <TouchableOpacity
            style={style.deleteContainer}
            onPress={() => {
              this.props.deleteClick();
            }}>
            <Image source={Assets.delete_cart} style={{}} />
          </TouchableOpacity>
        </View>

        {this.renderViewAddOns()}
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 6,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  innerContainer: {
    // margin: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 0.5,
  },
  itemImage: {
    flex: 2,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 18,
    fontFamily: ETFonts.bold,
    color: '#000',
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
  },
  addonText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontFamily: ETFonts.regular,
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

import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import BaseContainer from './BaseContainer';
import ProgressLoader from '../components/ProgressLoader';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import {ETFonts} from '../assets/FontConstants';
import PriceDetail from '../components/PriceDetail';
import {getUserToken} from '../utils/AsyncStorageHelper';

import CartItem from '../components/CartItem';
import {
  saveCartData,
  getCartList,
  getAddOnsList,
} from '../utils/AsyncStorageHelper';
import {strings} from '../locales/i18n';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  ADD_TO_CART,
  RESPONSE_SUCCESS,
  COUPON_ERROR,
  INR_SIGN,
  capiString,
  CHECK_ORDER_URL,
  GOOGLE_API_KEY,
  funGetTime,
  funGetTomorrowDate,
  funGetDate,
} from '../utils/Constants';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
import {connect} from 'react-redux';
import {saveCheckoutDetails, saveCartCount} from '../redux/actions/Checkout';
import {apiPost, apiPostFormData} from '../api/APIManager';
import {netStatus} from '../utils/NetworkStatusConnection';
//import { Messages } from "../utils/Messages";
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {getLanguage} from '../utils/AsyncStorageHelper';
import Moment from 'moment';
import Toast, {DURATION} from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';

// var radio_props = [
//   {label: strings('CartContainer.PickUp_order'), value: 0},
//   {label: strings('CartContainer.Delivery_order'), value: 1},
// ];
// var radio_props_order_now_later = [
//   {label: strings('CartContainer.Order_now'), value: 'now'},
//   {label: strings('CartContainer.Order_later'), value: 'later'},
// ];

export class CartContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.showDialogue = strings('CartContainer.showDialogue');
    this.alert = strings('CartContainer.alert');
    this.Applied = strings('CartContainer.Applied');
    this.PickUporder = strings('CartContainer.PickUporder');
    this.Deliveryorder = strings('CartContainer.Deliveryorder');
    this.CheckLanguage();

    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MemptyCartMsg = strings('Messages.emptyCartMsg');
    this.MdeleteItemMsg = strings('Messages.deleteItemMsg');
    this.PriceDetails = strings('CartContainer.PriceDetails');

    this.cartData = [];
    this.deleteIndex = -1;
    this.cart_id = 0;
    this.cartResponse = undefined;
  }

  state = {
    language: '',
    isLoading: false,
    isDeleteVisible: false,
    isAsyncSync: false,
    value: 1,
    order_Now_Later: 0,
    curr_latitude: 0.0,
    curr_longitude: 0.0,
    cartDataresponse: [],
    cartaddonsData: [],
    model_visible: false,
    eventTime: '',
    eventDate: '',
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    orderLater_dateTime: '',
  };

  _showDatePicker = () => this.setState({isDatePickerVisible: true});

  _hideDatePicker = () => this.setState({isDatePickerVisible: false});

  _showTimePicker = () => this.setState({isTimePickerVisible: true});

  _hideTimePicker = () => this.setState({isTimePickerVisible: false});

  _handleDatePicked = date => {
    var datePicked = funGetDate(date);
    this.setState({eventDate: datePicked, isDatePickerVisible: false});

    // this._hideDatePicker();
  };

  _handleTimePicked = date => {
    var timePicked = funGetTime(date);
    this.setState({eventTime: timePicked});
    this._hideTimePicker();
  };

  passFunction = data => {
    this.promoCode = data;
    this.getCartData(this.cartResponse.items);
  };

  componentDidMount() {
    // ('DD-MM-YYYY hh:mm A');
    this.checkUser();

    console.log('date time formate', Moment(new Date()).format('Y-M-D h:m:s '));
    console.log(
      'date time formate',
      Moment(new Date()).format('DD-MM-YYYY hh:mm A'),
    );
    getAddOnsList(
      success => {
        console.log('getAddOnsList success', success);
      },
      onCartNotFound => {},
      error => {},
    );

    this.didFocusEventHandler();
    getCartList(
      success => {
        console.log('getCartList', success);
        cartArray = success;
        this.promoCode = success.coupon_name;
        this.cart_id = success.cart_id;
        this.state.isAsyncSync = true;
        this.getCartData(cartArray.items);
      },
      emptyList => {
        this.cartResponse = {
          items: [],
        };
        this.setState({
          isAsyncSync: true,
        });
      },
      error => {
        this.cartResponse = {
          items: [],
        };
        this.setState({
          isAsyncSync: true,
        });
      },
    );

  }


  checkUser() {
    getUserToken(
      success => {
        userObj = success;
        this.loadData(success);
      },
      failure => {
        this.props.navigation.navigate('LoginContainer')
        //showValidationAlert(this.MloginValidation);
        console.log('sreeraj')
      },
    );
  }
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
  didFocusEventHandler = payload => {
    if (Platform.OS === 'android') {
      if (GOOGLE_API_KEY !== '') {
        Geocoder.init(GOOGLE_API_KEY);
        // this.setState({ isLoading: true });
        Geolocation.getCurrentPosition(
          position => {
            console.log(
              'CURRENT ADDRESSS :::::: ',
              position.coords.latitude,
              ' :::::::::: ',
              position.coords.longitude,
            );
            // this.driverTracking()
            this.setState(
              {
                curr_latitude: position.coords.latitude,
                curr_longitude: position.coords.longitude,
              },
              // ,()=> this.driverTracking()
            );
            // this.getAddress(position.coords.latitude, position.coords.longitude);
          },
          error => {
            console.log('ios DENIED');
            // showDialogue("Please allow location access from setting", [], "", () => {
            //     this.isOpenSetting = true;
            //     Linking.openURL("app-settings:");
            // });
            // this.setState({ isLoading: false });
            // this.setState({ error: error.message });
          },
          {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      } else {
        showDialogue(this.showDialogue, [], '');
      }
    } else {
      this.checkLocationIOS();
    }
  };

  checkLocationIOS() {
    if (GOOGLE_API_KEY !== '') {
      Geocoder.init(GOOGLE_API_KEY);
      // this.setState({ isLoading: true });
      Geolocation.getCurrentPosition(
        position => {
          console.log(
            'CURRENT ADDRESSS :::::: ',
            position.coords.latitude,
            ' :::::::::: ',
            position.coords.longitude,
          );

          this.setState(
            {
              curr_latitude: position.coords.latitude,
              curr_longitude: position.coords.longitude,
            },
            // ,()=> this.driverTracking()
          );
          // this.getAddress(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.log('ios DENIED');
          // showDialogue("Please allow location access from setting", [], "", () => {
          //     this.isOpenSetting = true;
          //     Linking.openURL("app-settings:");
          // });
          // this.setState({ isLoading: false });
          // this.setState({ error: error.message });
        },
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    } else {
      showDialogue(this.showDialogue, [], '');
    }
  }

  getCartData(items) {
    console.log('items1', items.length > 0 ? this.promoCode : '');
    console.log('items2', this.promoCode);
    console.log('items3', items.length);
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        console.log('items', items);
        const formData = new FormData();
        formData.append('language', this.state.language);
        formData.append('user_id', this.props.userID || '');
        formData.append('token', this.props.token || '');
        formData.append('restaurant_id', cartArray.resId);
        // formData.append('items', '{"items": }');
        formData.append('items', '{"items": ' + JSON.stringify(items) + '}');
        formData.append('cart_id', this.cart_id);
        formData.append('coupon', items.length > 0 ? this.promoCode : '');
        console.log('request param add to cart formData', formData);
        // console.log('param', param);
        apiPostFormData(
          ADD_TO_CART,
          formData,
          response => {
            if (response.error != undefined) {
              // showValidationAlert(
              //   response.error.message != undefined
              //     ? response.error.message
              //     : this.MgeneralWebServiceError,
              // );
              console.log("test");
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                var addonsData = [];
                response.items.map((item, index) => {
                  addonsData.push(item.addons);
                });
                console.log('addonsData====>', addonsData);
                response['addonsData'] = addonsData;
                this.setState({
                  cartDataresponse: response,
                  cartaddonsData: addonsData,
                });
                this.updateUI(response);
              } else if (response.status == COUPON_ERROR) {
                this.updateUI(response);
                showValidationAlert(response.message);
              } else {
                console.log('add to cart else ', response);
                showValidationAlert(response.message);
              }
            }
            this.setState({isLoading: false});
          },
          error => {
            console.log('add to cart error ', error);

            this.setState({isLoading: false});
            // showValidationAlert(
            //   error.response != undefined
            //     ? error.response
            //     : this.MgeneralWebServiceError,
            // );
          },
        );
      } else {
        
      // showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  saveCheckoutDataToRedux(data) {
    this.props.saveCheckoutDetails(data);
  }

  updateUI(response) {
    console.log('response updateUI', response);
    this.cartResponse = response;
    this.cart_id = response.cart_id;
    var itemdata = response.items.map((item, index) => {
      var addonsString = '';
      item.addons.map((item2, index) => {
        addonsString = addonsString.concat(item2.entity_id + ',');
      });
      item['addons'] = addonsString;
      console.log('final item', item);
    });

    console.log('itemdata', itemdata);

    var updatedCart = {
      resId: cartArray.resId,
      items: response.items,
      coupon_name: response.coupon_name,
      cart_id: response.cart_id,
    };
    console.log('response updatedCart', updatedCart);

    saveCartData(updatedCart, success => {}, fail => {});
    if (response.items.length == 0) {
      this.props.navigation.goBack();
    }
  }

  onSelectedIndex = value => {
    console.log('SELECTED VALUE ::::::::: ', value);
    this.setState({value: value});
  };
  onSelectedIndex_Now_Later = value => {
    console.log('SELECTED VALUE now Later::::::::: ', value);
    this.setState({order_Now_Later: value});
    if (value == 1) {
      this.setState({model_visible: true});
    }
  };

  checkOrderAPI = () => {
    console.log(
      '--------------seleted date time',
      this.state.orderLater_dateTime,
    );
    this.setState({isLoading: true});
    let param = {
      language: this.state.language,
      token: this.props.token,
      user_id: this.props.userID,
      // order_id: "",
      // is_delivered: "0",
      // reason: "test",
      order_delivery: 'Delivery',
      // latitude:this.state.curr_latitude,
      // longitude:this.state.curr_longitude,
      restaurant_id: cartArray.resId,
    };
    console.log('param checkOrderAPI', param);
    apiPost(
      CHECK_ORDER_URL,
      param,
      onSuccess => {
        console.log('Sugan API ', param);
        console.log('CHECK API SUCCESS ::::::: ', onSuccess);
        if (onSuccess.status === 0) {
          this.setState({isLoading: false});
          alert(this.alert);
        } else {
          var checkoutData = {
            address_id: 0,
            subtotal: this.cartResponse.subtotal,
            items: '{"items": ' + JSON.stringify(this.cartResponse.items) + '}',
            coupon_id: this.cartResponse.coupon_id,
            coupon_type: this.cartResponse.coupon_type,
            coupon_amount: this.cartResponse.coupon_amount,
            user_id: this.props.userID,
            token: this.props.token,
            restaurant_id: cartArray.resId,
            total: this.cartResponse.total,
            coupon_name: this.cartResponse.coupon_name,
            coupon_discount: this.cartResponse.coupon_discount,
            orderMethodIndex: this.state.value,
            latitude: this.state.curr_latitude,
            longitude: this.state.curr_longitude,
            order_delivery: 'Delivery',
            order_option: this.state.order_Now_Later == 0 ? 'now' : 'later',
            order_date:
              this.state.order_Now_Later == 0
                ? Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                : this.state.orderLater_dateTime,
          };
          console.log('checkoutData', checkoutData);
          this.saveCheckoutDataToRedux(checkoutData);

          this.props.navigation.navigate('AddressListContainer', {
            isSelectAddress: true,
            cartResponse: this.cartResponse,
          });
          this.setState({isLoading: false});
        }
      },
      onFailure => {
        console.log('CHECK API FAILURE ::::::: ', onFailure);
        this.setState({isLoading: false});
      },
    );
  };

  ModelClose = () => {
    this.setState({
      model_visible: false,
      order_Now_Later: 0,
      eventTime: '',
      eventDate: '',
    });
  };
  onPressSelectedDateTime = () => {
    if (this.state.eventTime == '' || this.state.eventDate == '') {
      alert('Please select date & time');
      // this.refs.toast.show('Please select date & time', DURATION.LENGTH_SHORT);
      return;
    } else {
      var seleteddate = Moment(this.state.eventDate, 'DD-MM-YYYY').format(
        'YYYY-MM-DD',
      );
      console.log('seleteddate', seleteddate);
      var seletedtime = Moment(this.state.eventTime, 'h:mm A').format(
        'HH:mm:ss',
      );
      console.log('seletedtime', seletedtime);
      console.log('this.state.eventTime', this.state.eventTime);
      console.log('this.state.eventDate', this.state.eventDate);
      this.setState({
        model_visible: false,
        order_Now_Later: 1,
      });

      var dateTime = seleteddate.concat(' ' + seletedtime);
      console.log('orderLater_dateTime', dateTime);
      this.setState({
        orderLater_dateTime: dateTime,
        eventTime: '',
        eventDate: '',
      });
    }
  };

  render() {
    return (
      <BaseContainer
        title={strings('CartContainer.Cart')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        <Modal
          visible={this.state.isDeleteVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.setState({isDeleteVisible: false});
          }}>
          {this.deleteDialog()}
        </Modal>

        {this.cartResponse != undefined && this.cartResponse.items.length > 0
          ? this.mainView()
          : this.cartResponse != undefined &&
            this.cartResponse.items.length <= 0
          ? this.emptyView()
          : null}
      </BaseContainer>
    );
  }

  emptyView() {
    return <Text style={style.emptyCartText}>{this.MemptyCartMsg}</Text>;
  }

  mainView() {
    // console.log('cartResponse :: ::-->', this.cartResponse);
    console.log(
      'this.state.cartData :: ::-->',
      this.state.cartDataresponse.items,
    );
    console.log('this.state.cartData :: ::-->', this.state.cartDataresponse);
    // console.log(
    //   'this.state.cartData1 :: ::-->',
    //   this.state.cartData.items[0].addons,
    // );
    var radio_props = [
      {label: strings('CartContainer.PickUp_order'), value: 0},
      {label: strings('CartContainer.Delivery_order'), value: 1},
    ];
    var radio_props_order_now_later = [
      {label: strings('CartContainer.Order_now'), value: 'now'},
      {label: strings('CartContainer.Order_later'), value: 'later'},
    ];

    return (
      <View style={{flex: 1, paddingBottom: 5}}>
        <FlatList
          // data={this.state.cartDataresponse.items}
          data={this.cartResponse != undefined ? this.cartResponse.items : []}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            console.log('item.addons', item.addons);
            return (
              <CartItem
                itemImage={item.image}
                itemName={item.name}
                price={INR_SIGN + ' ' + item.price}
                rating={item.rating}
                quantity={item.quantity}
                //  cartDataresponse={this.state.cartDataresponse}
                cartaddonsData={this.state.cartaddonsData}
                index={index}
                onPlusClick={value => {
                  if (value > 0) {
                    this.cartResponse.items[index].quantity = value;
                    this.getCartData(this.cartResponse.items);
                  }
                }}
                onMinusClick={value => {
                  if (value > 0) {
                    this.cartResponse.items[index].quantity = value;
                    this.getCartData(this.cartResponse.items);
                  } else if (value == 0) {
                    var array = this.cartResponse.items;
                    array.splice(index, 1);
                    this.getCartData(array);
                  }
                }}
                isVeg={item.is_veg}
                deleteClick={() => {
                  this.deleteIndex = index;
                  this.setState({isDeleteVisible: true});
                }}
              />
            );
          }}
          keyExtractor={(item, index) => item + index}
        />

        <Modal
          visible={this.state.model_visible}
          animationType="slide"
          transparent={true}
          style={{backgroundColor: 'rgba(255, 0, 0, 0.0)'}}
          onRequestClose={() => this.ModelClose()}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'flex-end'}}
            onPress={() => this.ModelClose()}>
            <View style={style.modalContainer}>
              <Toast
                style={{backgroundColor: 'gray'}}
                textStyle={{color: 'red'}}
                ref="toast"
                position="center"
                fadeInDuration={0}
              />
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontFamily: ETFonts.bold,
                    fontSize: 16,
                  }}>
                  {strings('CartContainer.SelectDateTime')}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                  height: '100%',
                }}>
                <View style={{justifyContent: 'space-between'}}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this._showTimePicker}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginVertical: 10,
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1, marginRight: 10}}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: 'gray',
                            textAlign: 'left',
                            fontFamily: ETFonts.regular,
                          }}>
                          {strings('CartContainer.SelectTime')}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={{
                            fontWeight: 'bold',
                            color: '#000',
                            fontFamily: ETFonts.bold,
                            fontSize: 14,
                          }}>
                          {this.state.eventTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          margin: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            margin: 4,
                            // borderRadius: 10,
                            alignSelf: 'center',
                          }}>
                          <Image
                            source={Assets.time}
                            resizeMode={'contain'}
                            style={{marginHorizontal: 5}}
                          />
                        </View>
                        <DateTimePicker
                          isVisible={this.state.isTimePickerVisible}
                          mode={'time'}
                          onConfirm={this._handleTimePicked}
                          onCancel={this._hideTimePicker}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this._showDatePicker}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginVertical: 10,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          marginRight: 10,
                          alignSelf: 'center',
                          marginLeft: 2,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: 'gray',
                            textAlign: 'left',
                            fontFamily: ETFonts.regular,
                          }}>
                          {strings('CartContainer.SelectDate')}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={{
                            fontWeight: 'bold',
                            color: '#000',
                            fontFamily: ETFonts.bold,
                            fontSize: 14,
                          }}>
                          {this.state.eventDate}
                        </Text>
                      </View>
                      <View
                        style={{
                          margin: 5,
                        }}>
                        <View
                          style={{
                            borderRadius: 10,
                            margin: 2,
                          }}>
                          <Image
                            source={Assets.calender}
                            resizeMode={'contain'}
                            style={{marginHorizontal: 5}}
                          />
                        </View>

                        <DateTimePicker
                          isVisible={this.state.isDatePickerVisible}
                          mode={'date'}
                          minimumDate={funGetTomorrowDate()}
                          onConfirm={this._handleDatePicked}
                          onCancel={this._hideDatePicker}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    marginBottom: 30,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.onPressSelectedDateTime()}>
                    <Text style={style.dateTimeOnButton}>
                      {strings('alert.ok')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={{}}>
          <View style={style.priceContainer}>
            <Text style={style.title}>
              {strings('CartContainer.PriceDetails')}
            </Text>
            <View style={style.divider} />

            {this.cartResponse.price != undefined ? (
              this.cartResponse.price.map((item, index) => {
                return (
                  <PriceDetail
                    key={item.label}
                    title={
                      item.label != undefined ? capiString(item.label) : ''
                    }
                    price={
                      item.value != undefined
                        ? item.label.includes('total') ||
                          item.label.includes('Total') ||
                          item.label.includes('Discount')
                          ? INR_SIGN + ' ' + item.value
                          : item.value
                        : ''
                    }
                  />
                );
              })
            ) : (
              <View />
            )}
          </View>

          <View
            style={{
              borderRadius: 6,
              marginLeft: 10,
              marginRight: 10,
              backgroundColor: '#fff',
            }}>
            {this.cartResponse.is_apply == true ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: ETFonts.regular,
                    fontSize: 15,
                    alignSelf: 'center',
                    color: EDColors.primary,
                    textAlign: 'center',
                  }}>
                  {this.promoCode + this.Applied}
                </Text>
                <TouchableOpacity
                  style={{alignSelf: 'center', marginRight: 10}}
                  onPress={() => {
                    this.promoCode = '';
                    this.getCartData(this.cartResponse.items);
                  }}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      height: 15,
                      width: 15,
                    }}
                    source={Assets.ic_close}
                  />
                </TouchableOpacity>
              </View>
            ) : this.props.userID != undefined && this.props.userID != '' ? (
              <Text
                style={style.promoCode}
                onPress={() => {
                  this.props.navigation.navigate('PromoCodeContainer', {
                    getData: this.passFunction,
                    subTotal: this.cartResponse.subtotal,
                    resId: cartArray.resId,
                  });
                }}>
                {strings('CartContainer.Have')}
              </Text>
            ) : null}
          </View>

          <RadioGroup
            color={EDColors.primary || EDColors.text}
            onSelect={this.onSelectedIndex}
            // style={{ flex: 1, alignItem: "flex-end" }}
            style={{marginLeft: 10, marginRight: 10}}
            selectedIndex={this.state.value}>
            {radio_props.map(index => {
              // paymentMethodToIterate.code == PaymentMethods.bankTransfer
              return (
                <RadioButton
                  key={index.label}
                  // style={{
                  //     flexDirection: isRTLCheck() ? "row-reverse" : "row", padding: 0,
                  //     paddingHorizontal: this.arrayPaymentMethods.length > 1 ? 10 : 0, paddingTop: 10
                  // }}
                  value={index.label}>
                  <Text>{index.label}</Text>
                </RadioButton>
              );
            })}
          </RadioGroup>
          {/* {this.state.value === 1 && ( */}
          <View
            style={{
              borderRadius: 6,
              marginLeft: 10,
              marginRight: 10,
              backgroundColor: '#fff',
            }}>
            <RadioGroup
              color={EDColors.primary || EDColors.text}
              onSelect={this.onSelectedIndex_Now_Later}
              style={{
                marginLeft: 10,
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
              selectedIndex={this.state.order_Now_Later}>
              {radio_props_order_now_later.map(index => {
                return (
                  <RadioButton key={index.label} value={index.label}>
                    <Text>{index.label}</Text>
                  </RadioButton>
                );
              })}
            </RadioGroup>
          </View>
          {/* )} */}

          <View style={style.checkOutContainer}>
            <Text style={style.totalPrice}>
              {INR_SIGN + ' ' + this.cartResponse.total}
            </Text>

            <TouchableOpacity
              style={style.roundButton}
              onPress={() => {
                if (this.props.userID != undefined && this.props.userID != '') {
                  if (this.state.value === 1) {
                    this.checkOrderAPI();
                  } else {
                    var checkoutData = {
                      address_id: 0,
                      subtotal: this.cartResponse.subtotal,
                      items:
                        '{"items": ' +
                        JSON.stringify(this.cartResponse.items) +
                        '}',
                      coupon_id: this.cartResponse.coupon_id,
                      coupon_type: this.cartResponse.coupon_type,
                      coupon_amount: this.cartResponse.coupon_amount,
                      user_id: this.props.userID,
                      token: this.props.token,
                      restaurant_id: cartArray.resId,
                      total: this.cartResponse.total,
                      coupon_name: this.cartResponse.coupon_name,
                      coupon_discount: this.cartResponse.coupon_discount,
                      orderMethodIndex: this.state.value,
                      latitude: 0.0,
                      longitude: 0.0,
                      order_delivery: 'PickUp',
                      order_option:
                        this.state.order_Now_Later == 0 ? 'now' : 'later',
                      order_date:
                        this.state.order_Now_Later == 0
                          ? Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                          : this.state.orderLater_dateTime,
                    };

                    this.saveCheckoutDataToRedux(checkoutData);
                    this.props.navigation.navigate('PaymentContainer', {
                      cartResponse: this.cartResponse,
                    });

                    // this.props.navigation.navigate("AddressListContainer", {
                    //   isSelectAddress: true
                    // });
                  }
                } else {
                  this.props.navigation.navigate('LoginContainer', {
                    isCheckout: true,
                  });
                }
              }}>
              <Text style={style.button}>
                {strings('CartContainer.CHECKOUT')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  deleteDialog() {
    console.log('=============================', this.cartResponse);
    return (
      <View style={style.modalContainer}>
        <View style={style.modalSubContainer}>
          <Text style={style.deleteTitle}>{this.MdeleteItemMsg}</Text>

          <View style={style.optionContainer}>
            <Text
              style={style.deleteOption}
              onPress={() => {
                console.log('this.deleteIndex', this.deleteIndex);
                var array = this.cartResponse.items;
                var price = this.cartResponse.price;
                console.log('array 1', array);
                console.log('array price', price);
                array.splice(this.deleteIndex, 1);
                console.log('array 2', array);
                this.getCartData(array);
                this.setState({isDeleteVisible: false});
              }}>
              Yes
            </Text>

            <Text
              style={style.deleteOption}
              onPress={() => {
                this.deleteIndex = -1;
                this.setState({isDeleteVisible: false});
              }}>
              No
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux,
      cartCount: state.checkoutReducer.cartCount,
    };
  },
  dispatch => {
    return {
      saveCheckoutDetails: checkoutData => {
        dispatch(saveCheckoutDetails(checkoutData));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(CartContainer);

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    textAlign: 'left',
    margin: 10,
  },
  modalContainer: {
    height: '50%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  dateTimeOnButton: {
    paddingTop: 10,
    paddingRight: 50,
    paddingLeft: 50,
    paddingBottom: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
    alignSelf: 'center',
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4,
    fontSize: 18,
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  deleteTitle: {
    fontFamily: ETFonts.bold,
    fontSize: 15,
    color: '#000',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteOption: {
    fontFamily: ETFonts.bold,
    fontSize: 12,
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    backgroundColor: EDColors.primary,
  },
  title: {
    fontFamily: ETFonts.bold,
    color: '#000',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    textAlign: 'left',
    marginBottom: 4,
  },
  divider: {
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#000',
    textAlign: 'left',
    height: 1,
  },
  promoCode: {
    alignSelf: 'center',
    color: EDColors.primary,
    fontFamily: ETFonts.regular,
    fontSize: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  checkOutContainer: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  totalPrice: {
    flex: 1,
    fontFamily: ETFonts.regular,
    fontSize: 20,
    alignSelf: 'center',
    marginLeft: 10,
  },
  roundButton: {
    alignSelf: 'center',
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4,
  },
  button: {
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
  },
  apply: {
    padding: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
  },
  emptyCartText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    color: '#000',
    fontSize: 15,
    fontFamily: ETFonts.regular,
  },
});

// const navigationAction = NavigationActions.navigate({
//   routeName: "Order", // <==== this is stackNavigator
//   action: NavigationActions.navigate({
//     routeName: "MyOrderContainer" // <===== this is defaultScreen for Portfolio
//   })
// });
// this.props.navigation.dispatch(navigationAction);

// this.props.navigation.dispatch(
//   StackActions.reset({
//     index: 6,
//     // key: "HOME_SCREEN_DRAWER",
//     routeName: "MAIN_NAVIGATOR",
//     key: "Home",
//     actions: [
//        NavigationActions.navigate({
//          routeName: "MainContainer"
//        }),
//        NavigationActions.navigate({
//          routeName: "MyOrderContainer"
//        })
//       this.props.navigation.dispatch(
//         NavigationActions.navigate({
//           routeName: "Order", // <==== this is stackNavigator,
//           key: "Order",
//           action: NavigationActions.navigate({
//             routeName: "MyOrderContainer" // <===== this is defaultScreen for Portfolio
//           })
//         })
//       )
//     ]
//   })
// );

// this.props.navigation.dispatch(
//   StackActions.reset({
//     index: 0,
//     key: null,
//     actions: [
//       NavigationActions.navigate({
//         routeName: "MY_ORDER_NAVIGATOR"
//       })
//     ]
//   })
// );
// this.props.navigation.navigate("Order");

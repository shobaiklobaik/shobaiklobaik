import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  Modal,
  Dimensions,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import ProgressLoader from '../components/ProgressLoader';
import {ETFonts} from '../assets/FontConstants';
import {EDColors} from '../assets/Colors';
import {
  saveCartData,
  getCartList,
  getUserToken,
  saveAddOnsData,
  clearAddOnsData,
} from '../utils/AsyncStorageHelper';
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  INR_SIGN,
  CART_PENDING_ITEMS,
  ADD_ONS,
} from '../utils/Constants';
//import { Messages } from "../utils/Messages";
import {showValidationAlert} from '../utils/CMAlert';
import {apiPostFormData, apiPost} from '../api/APIManager';
import {connect} from 'react-redux';
import {saveCartCount} from '../redux/actions/Checkout';
import {netStatus} from '../utils/NetworkStatusConnection';
import MyWebView from 'react-native-webview';
import Toast, {DURATION} from 'react-native-easy-toast';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import SelectMultiple from '../components/selectMultiple/src/SelectMultiple';
import {CheckBox} from 'react-native-elements';
var _ = require('underscore');
import FastImage from 'react-native-fast-image';
import unchecked from '../assets/image/unchecked.png';
import checked from '../assets/image/checked.png';

class RestaurantDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.McartItemNotAvailable = strings('Messages.cartItemNotAvailable');
    this.CheckLanguage();

    this.isClose = '';
    getUserToken(
      success => {
        user = success;
      },
      fail => {},
    );
    this.resId = this.props.navigation.state.params.resid;
    this.menuItem = [];
    this.foodType = '';
    this.priceType = '';
    this.cartCount = 0;
    this.not = strings('RestaurantDetail.not');
    this.add = strings('RestaurantDetail.add');

    this.fontSize = Platform.OS == 'ios' ? '18px' : '18px';
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';

    this.customStyle =
      this.meta +
      '<style>* {max-width: 100%;} body {font-size:' +
      this.fontSize +
      ';}</style>';
  }

  state = {
    language: '',
    isLoading: false,
    isEnable: false,
    visible: false,
    model_addons_visible: false,
    selectedAddons: [],
    addOns_data: [],
    addOnsMultiData: [],
    addOnsTotalprice: 0,
    itemprice: 0,
    totalAddonsData: [],
    addcartData: [],
    menu_id: undefined,
    isClose: '',
    data: '',
    itemTitle: '',
    menuItem: [
      {
        title: '',
        data: [{uri: this.props.navigation.state.params.image}],
        isShow: false,
        index: 0,
      },
    ],
    isChecked: [],
    selectedLists: [],
    updateFlatlist: true,
    refreshing: false,
  };

  componentDidMount() {
    this.getRestaurantDetails();
  }

  getRestaurantDetails() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        const formData = new FormData();
        formData.append('language', this.state.language);
        formData.append('restaurant_id', parseInt(this.resId));
        formData.append('food', this.foodType);
        formData.append('price', this.priceType);

        // {
        //   restaurant_id: parseInt(this.resId),
        //   food: this.foodType,
        //   price: this.priceType
        // }

        apiPostFormData(
          GET_RESTAURANT_DETAIL,
          formData,
          response => {
            console.log('GET_RESTAURANT_DETAIL :: ::', response);
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.menuItem = [
                {
                  title: '',
                  data: [{uri: this.props.navigation.state.params.image}],
                  isShow: false,
                  index: 0,
                },
              ];

              if (response.menu_item.length > 0) {
                response.menu_item.map((item, index) => {
                  this.menuItem[index + 1] = {
                    title: item.category_name,
                    data: item.items,
                    isShow: index == 0 ? true : false,
                    index: index + 1,
                  };
                });
              }

              // this.isClose = response.restaurant[0].timings.closing
              this.setState({
                isLoading: false,
                isClose: response.restaurant[0].timings.closing,
              });
            } else if (response.status == RESPONSE_FAIL) {
              this.setState({isLoading: false});
            }
          },
          error => {
            this.setState({isLoading: false});
            showValidationAlert(
              error.response != undefined
                ? error.response
                : this.MgeneralWebServiceError,
            );
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
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

  openSideDrawer = () => {
    this.props.navigation.goBack();
  };

  testFunction = data => {
    this.foodType = data.food;
    this.priceType = data.price;

    this.getRestaurantDetails();
  };

  rightClick = index => {
    if (index == 0) {
      if (this.props.cartCount > 0) {
        this.props.navigation.navigate('CartContainer');
      } else {
        showValidationAlert(this.McartItemNotAvailable);
      }
    } else if (index == 1) {
      this.props.navigation.navigate('Filter', {
        getFilterDetails: this.testFunction,
        filterType: 'menu',
        food: this.foodType,
        price: this.priceType,
      });
    }
  };

  add_To_Cart = data => {
    console.log('add_To_Cart :: ::', data);
    console.log('add_To_Cart menu_id :: ::', data.menu_id);
    console.log('this.resId', this.resId);
    this.setState({menu_id: data.menu_id, addcartData: data});
    this.callApi_AddOns(data, this.resId, parseFloat(data.price));
  };

  callApi_AddOns(particulerItemData, restaurant_id, price) {
    var param = {
      item_id: particulerItemData.menu_id,
      restaurant_id: restaurant_id,
    };
    console.log('param:: ::', param);
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          ADD_ONS,
          param,
          response => {
            console.log('ADD_ONS :: ::', response);
            this.setState({isLoading: false});
            if (response.status == -1) {
              console.log('ADD_ONS -1', response);
              var addonsString = '';
              this.storeData(particulerItemData, addonsString);
            } else {
              const {data} = response;
              if (data.length > 0) {
                console.log('add ons data', data);
                var itemData = [];
                data.map((item, index) => {
                  const particuleritem = {
                    label: item.addons_name,
                    value: item.price,
                  };
                  itemData.push(particuleritem);
                });
                this.setState({
                  model_addons_visible: true,
                  addOns_data: data,
                  addOnsMultiData: itemData,
                  itemprice: parseFloat(price),
                });
              } else {
                var addonsString = '';
                this.storeData(particulerItemData, addonsString);
              }
            }
          },
          error => {
            console.log('error', error);
            this.setState({isLoading: false});
            showValidationAlert(
              error.response != undefined
                ? error.response
                : this.MgeneralWebServiceError,
            );
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  renderLabel = (label, value, style, selected) => {
    console.log('value', value);
    return (
      <View
        style={{width: '90%', flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{width: '65%'}}>
          <Text style={{fontSize: 18, fontFamily: ETFonts.regular}}>
            {label}
          </Text>
        </View>
        <View style={{width: '25%'}}>
          <Text
            style={{
              textAlign: 'right',
              fontSize: 18,
              fontFamily: ETFonts.regular,
            }}>
            {INR_SIGN + ' ' + value}
          </Text>
        </View>
      </View>
    );
  };

  _onRefresh = () => {
    const {refreshing} = this.state;
    this.setState({refreshing: !refreshing});
    // fetchData().then(() => {
    //   this.setState({refreshing: false});
    // });
  };

  _renderListItem = ({item, index}) => {
    console.log('this.state.isChecked _renderListItem', this.state.isChecked);
    return (
      <View>
        <CheckBox
          checked={this.state.isChecked[index]}
          onPress={() => this.isIconCheckedOrNot(item, index)}
          title="Click Here"
        />
        <CheckBox checked={true} title={item.addons_name} />
        <Text>{item.price}</Text>
      </View>
    );
  };

  isIconCheckedOrNot = (item, index) => {
    console.log('isIconCheckedOrNot', item, index);
    let {isChecked, selectedLists, updateFlatlist} = this.state;
    isChecked[index] = !isChecked[index];
    this.setState({isChecked: isChecked});
    this.setState({updateFlatlist: !updateFlatlist});
    console.log('isChecked', isChecked);
    if (isChecked[index] == true) {
      selectedLists.push(item);
    } else {
      selectedLists.pop(item);
    }
    console.log('selectedLists', selectedLists);
  };

  onSelectionsChange = selectedAddons => {
    const {addOns_data, addOnsTotalprice} = this.state;
    console.log('addOns_data', addOns_data);
    console.log('selectedAddons', selectedAddons);
    var selectedItem = [];
    addOns_data.map((addonitem, index) => {
      selectedAddons.map((selecteditem, index) => {
        if (addonitem.addons_name === selecteditem.label) {
          console.log('match', addonitem);
          addonitem['menu_id'] = this.state.menu_id;
          selectedItem.push(addonitem);
        }
      });
    });
    console.log('=============selectedItem=========', selectedItem);
    var total = 0;
    selectedItem.map((item, index) => {
      total = total + parseFloat(item.price);
      console.log('total inside==>', total);
    });
    console.log('total==>', total);
    this.setState({addOnsTotalprice: total, totalAddonsData: selectedItem});
    this.setState({selectedAddons});
  };
  addOnsModelClose = () => {
    this.setState({
      model_addons_visible: false,
      selectedAddons: [],
      addOns_data: [],
      addOnsMultiData: [],
      addOnsTotalprice: 0,
      itemprice: 0,
      totalAddonsData: [],
    });
  };

  onPressAddOns = () => {
    var data = {
      resId: this.resId,
      items: [this.state.totalAddonsData],
    };
    console.log('this.state.totalAddonsData :: ', this.state.totalAddonsData);
    var addonsString = '';
    this.state.totalAddonsData.map((item, index) => {
      if (index == 0) {
        addonsString = addonsString.concat(item.entity_id);
      } else if (index > 0) {
        addonsString = addonsString.concat(',', item.entity_id);
      }
    });
    console.log('this.state.addcartData', this.state.addcartData);
    console.log('addonsString', addonsString);
    this.storeData(this.state.addcartData, addonsString);
  };

  storeData(data, addonsString) {
    var cartArray = [];
    var cartData = {};
    //demo changes
    getCartList(
      success => {
        console.log('111111111111111111111111111111111');
        if (success != undefined) {
          cartArray = success.items;

          if (cartArray.length > 0) {
            if (success.resId == this.resId) {
              //cart has already data
              var repeatArray = cartArray.filter(item => {
                return item.menu_id == data.menu_id;
              });

              if (repeatArray.length > 0) {
                console.log('repeatArray inside if', repeatArray);
                if (addonsString == undefined) {
                  repeatArray[0]['addons'] = '';
                } else {
                  repeatArray[0]['addons'] = addonsString;
                }
                repeatArray[0].quantity = repeatArray[0].quantity + 1;
              } else {
                if (addonsString == undefined) {
                  data['addons'] = '';
                } else {
                  data['addons'] = addonsString;
                }
                data.quantity = 1;
                console.log('else data', data);
                cartArray.push(data);
              }
              console.log('repeatArray', repeatArray);
              cartData = {
                resId: this.resId,
                items: cartArray,
                coupon_name:
                  success.coupon_name.length > 0 ? success.coupon_name : '',
                cart_id: success.cart_id,
              };
              console.log('CART DATA :::::::: ', cartData);
              this.updateCount(cartData.items);
              this.saveData(cartData);
            } else {
              showValidationAlert(CART_PENDING_ITEMS);
            }
          } else if (cartArray.length == 0) {
            console.log('22222222222222222222222222222222222222222', data);
            console.log('cartData::: :::: :::: :::', cartData);

            //cart empty
            data.quantity = 1;
            if (addonsString == undefined) {
              data['addons'] = '';
            } else {
              data['addons'] = addonsString;
            }
            cartData = {
              resId: this.resId,
              items: [data],
              coupon_name: '',
              cart_id: 0,
            };
            this.updateCount(cartData.items);
            this.saveData(cartData);
          }
        } else {
          //cart has no data
          console.log('3333333333333333333333333333333', data);
          data.quantity = 1;
          if (addonsString == undefined) {
            data['addons'] = '';
          } else {
            data['addons'] = addonsString;
          }
          cartData = {
            resId: this.resId,
            items: [data],
            coupon_name: '',
            cart_id: 0,
          };
          console.log('cartData::: :::: :::: :::', cartData);

          this.updateCount(cartData.items);
          this.saveData(cartData);
        }
      },
      onCartNotFound => {
        //first time insert data
        console.log('onCartNotFound', onCartNotFound);
        console.log('4444444444444444444444444444444444', data);
        data.quantity = 1;
        if (addonsString == undefined) {
          data['addons'] = '';
        } else {
          data['addons'] = addonsString;
        }
        cartData = {
          resId: this.resId,
          items: [data],
          coupon_name: '',
          cart_id: 0,
        };
        console.log('cartData::: :::: :::: :::', cartData);

        this.updateCount(cartData.items);
        this.saveData(cartData);
      },
      error => {
        console.log('onCartNotFound', error);
      },
    );
  }

  updateCount(data) {
    console.log('toast call');
    this.refs.toast.show(this.add, DURATION.LENGTH_SHORT);
    var count = 0;
    data.map((item, index) => {
      count = count + item.quantity;
    });

    this.props.saveCartCount(count);
    console.log('saveCartCount', saveCartCount);
  }

  saveData(data) {
    console.log('store data :: :: :: :: :: :: :: :: :: :: ::', data);
    saveCartData(
      data,
      success => {
        console.log(
          '=====================================data stored success fully=====================================',
          success,
        );
        this.addOnsModelClose();
      },
      fail => {},
    );
  }
  save_Addons_Data(data) {
    saveAddOnsData(data, success => {}, fail => {});
  }

  render() {
    this.props.navigation.addListener('didFocus', payload => {
      getCartList(
        success => {
          if (success != undefined) {
            cartData = success.items;
            if (cartData.length > 0) {
              var count = 0;
              cartData.map((item, index) => {
                count = count + item.quantity;
              });

              this.props.saveCartCount(count);
            } else if (cartData.length == 0) {
              this.props.saveCartCount(0);
            }
          } else {
          }
        },
        onCartNotFound => {},
        error => {},
      );
    });
    console.log('this.state.addOnsMultiData', this.state.addOnsMultiData);
    return (
      <BaseContainer
        title={this.props.navigation.state.params.resName}
        left="Back"
        right={[
          {url: Assets.ic_cart, name: 'Cart', value: this.props.cartCount},
          {url: Assets.ic_filter, name: 'filter'},
        ]}
        onLeft={this.openSideDrawer}
        onRight={this.rightClick}>
        <Toast ref="toast" position="center" fadeInDuration={0} />
        <View style={{flex: 1}}>
          {this.state.isLoading ? <ProgressLoader /> : null}
          <Modal
            visible={this.state.visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => this.setState({visible: false})}>
            <View style={style.modalContainer}>
              <View style={style.modalSubContainer}>
                <View style={{flexDirection: 'row', height: 20}}>
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: ETFonts.bold,
                      color: '#000',
                      fontSize: 15,
                    }}
                    html={this.state.data}>
                    {this.state.data.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({visible: false})}>
                    <Image
                      style={{alignSelf: 'center', height: 15, width: 15}}
                      source={Assets.ic_close}
                    />
                  </TouchableOpacity>
                </View>

                <FastImage
                  source={{uri: this.state.data.image}}
                  style={{
                    width: '100%',
                    height: 180,
                    marginTop: 10,
                    borderRadius: 6,
                  }}
                />
                <MyWebView
                  source={{
                    html: this.customStyle + this.state.data.receipe_detail,
                  }}
                  width="100%"
                  startInLoadingState={true}
                  style={{
                    flex: 1,
                    alignSelf: 'flex-start',
                    paddingBottom: Platform.OS == 'ios' ? 0 : 15,
                    // width: "100%"
                  }}
                  scrollEnabled={true}
                />
              </View>
            </View>
          </Modal>

          <Modal
            visible={this.state.model_addons_visible}
            animationType="slide"
            transparent={true}
            style={{backgroundColor: 'red'}}
            onRequestClose={() => this.addOnsModelClose()}>
            <View style={style.modalContainer1}>
              <TouchableWithoutFeedback onPress={() => this.addOnsModelClose()}>
                <View style={{height: 150, width: '100%'}} />
              </TouchableWithoutFeedback>

              <View style={{backgroundColor: '#fff', flex: 1}}>
                <View
                  style={{
                    marginBottom: 10,
                    backgroundColor: EDColors.primary,
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: EDColors.primary,
                        fontFamily: ETFonts.bold,
                        fontSize: 16,
                      }}>
                      ADD ONS
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: ETFonts.bold,
                        fontSize: 16,
                      }}>
                      {strings('CartContainer.addons')}
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={{
                        padding: 20,
                      }}
                      onPress={() => {
                        this.setState({model_addons_visible: false});
                      }}>
                      <Image
                        style={{
                          alignContent: 'flex-end',
                          height: 25,
                          width: 25,
                        }}
                        source={Assets.delete_White}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <SelectMultiple
                  items={this.state.addOnsMultiData}
                  selectedItems={this.state.selectedAddons}
                  onSelectionsChange={this.onSelectionsChange}
                  rowStyle={style.selectMultipleRawStyle}
                  labelStyle={style.optionsFont}
                  renderLabel={this.renderLabel}
                />
                <View style={{justifyContent: 'flex-start', marginBottom: 30}}>
                  <TouchableOpacity onPress={() => this.onPressAddOns()}>
                    <Text style={style.button}>{`Add ${INR_SIGN} ${this.state
                      .itemprice + this.state.addOnsTotalprice}`}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {this.menuItem.length > 1 ? (
            <SectionList
              showsVerticalScrollIndicator={false}
              extraData={this.state}
              renderSectionHeader={({section: {title, index, isShow}}) => {
                return title != '' ? (
                  this.itemHeader(title, index, isShow)
                ) : (
                  <View />
                );
              }}
              sections={this.menuItem}
              renderItem={({item, index, section}) => {
                if (section.index == 0) {
                  return (
                    <View style={{flex: 1}}>
                      <FastImage
                        source={{
                          uri: item.uri,
                        }}
                        style={{width: '100%', height: 200}}
                      />
                      <View style={{padding: 5}}>
                        {this.state.isClose.toLowerCase() !== 'open' ? (
                          <Text
                            style={{
                              flex: 1,
                              color: 'red',
                              alignSelf: 'center',
                              fontFamily: ETFonts.bold,
                            }}>
                            Closed
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  );
                } else {
                  if (section.isShow) {
                    return this.nestedItem(item);
                  } else {
                    return null;
                  }
                }
              }}
              keyExtractor={(item, index) => item + index}
            />
          ) : this.menuItem.length > 0 ? (
            <View style={{flex: 1}}>
              <FastImage
                source={{
                  uri: this.props.navigation.state.params.image,
                }}
                style={{width: '100%', height: 200}}
              />
              {this.emptyView()}
            </View>
          ) : null}
        </View>
      </BaseContainer>
    );
  }

  emptyView() {
    return <Text style={style.emptyView}>No Data Found</Text>;
  }

  itemHeader(data, index, isShow) {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={style.itemContainer}
        onPress={() => {
          if (isShow) {
            this.menuItem[index].isShow = false;
            this.setState({isEnable: this.state.isEnable ? false : true});
          } else {
            this.menuItem[index].isShow = true;
            this.setState({isEnable: this.state.isEnable ? false : true});
          }
        }}>
        <Text style={style.itemTitle}>{data}</Text>
        <Image
          style={style.rightImage}
          source={isShow ? Assets.ic_down_arrow : Assets.ic_up_arrow}
        />
      </TouchableOpacity>
    );
  }

  nestedItem(data) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          console.log('restaurant Sugan' + data.receipe_detail);

          this.setState({
            visible: true,
            data: data,
          });
        }}>
        <View style={style.nestedContainer}>
          <FastImage
            source={{uri: data.image}}
            style={{height: 70, width: 70, borderRadius: 35}}
          />
          <View style={{flex: 4, marginLeft: 10, marginRight: 10}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: data.is_veg == '1' ? '#239957' : '#A52A2A',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    margin: 2,
                    borderRadius: 6,
                    backgroundColor: data.is_veg == '1' ? '#239957' : '#A52A2A',
                  }}
                />
              </View>
              <Text style={style.nestedTitle}>{data.name}</Text>
            </View>
            <Text style={style.nestedDesc}>{data.menu_detail}</Text>

            <Text style={style.nestedPrice}>{INR_SIGN + ' ' + data.price}</Text>
          </View>

          <View style={{alignSelf: 'center'}}>
            {this.state.isClose.toLowerCase() === 'open' ? (
              <TouchableOpacity
                onPress={() => {
                  this.add_To_Cart(data);
                }}>
                <View style={style.nestedRoundView}>
                  <Image
                    source={Assets.ic_plus_yellow}
                    style={{
                      width: 10,
                      height: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
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
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(RestaurantDetail);

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  modalContainer1: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  selectMultipleRawStyle: {
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  optionsFont: {
    marginLeft: 10,
    fontFamily: ETFonts.bold,
    color: '#000',
    fontSize: 16,
  },
  button: {
    paddingTop: 10,
    paddingRight: 30,
    paddingLeft: 30,
    paddingBottom: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
    alignSelf: 'center',
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4,
    fontSize: 18,
  },
  emptyView: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    color: '#000',
    fontSize: 15,
    fontFamily: ETFonts.regular,
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 180,
    marginTop: 40,
    marginBottom: 40,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    margin: 5,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  itemTitle: {
    flex: 3,
    color: '#000',
    padding: 10,
    fontFamily: ETFonts.regular,
    fontSize: 18,
  },
  rightImage: {
    alignSelf: 'center',
    marginEnd: 10,
  },
  nestedContainer: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  nestedTitle: {
    fontFamily: ETFonts.bold,
    color: '#000',
    fontSize: 18,
    marginLeft: 5,
  },
  nestedDesc: {
    fontFamily: ETFonts.regular,
    fontSize: 10,
    marginTop: 10,
  },
  nestedPrice: {
    fontFamily: ETFonts.regular,
    marginTop: 10,
    color: '#000',
    fontSize: 15,
  },
  nestedRoundView: {
    borderWidth: 1,
    borderColor: EDColors.activeTabColor,
    borderRadius: 16,
    alignSelf: 'center',
    padding: 5,
  },
});

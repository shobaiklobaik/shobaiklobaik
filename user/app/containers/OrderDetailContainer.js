import React from 'react';
import {
  Modal,
  View,
  FlatList,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import Assets from '../assets';
import BaseContainer from './BaseContainer';
import EDThemeButton from '../components/EDThemeButton';
import {
  getUserToken,
  getCartList,
  saveCartData,
  clearCartData,
} from '../utils/AsyncStorageHelper';
import {netStatus} from '../utils/NetworkStatusConnection';
import {apiPost} from '../api/APIManager';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
import {
  funGetDateStr,
  INR_SIGN,
  CART_PENDING_ITEMS,
  ORDER_REVIEW,
  DRIVER_REVIEW,
  GET_REVIEW,
} from '../utils/Constants';
import {EDColors} from '../assets/Colors';
import PriceDetail from '../components/PriceDetail';
import ETextViewNormalLable from '../components/ETextViewNormalLable';
import {ETFonts} from '../assets/FontConstants';
import OrderItem from '../components/OrderItem';
import {strings} from '../locales/i18n';
import {getLanguage, getUserLoginData} from '../utils/AsyncStorageHelper';
import {Rating, AirbnbRating} from 'react-native-ratings';
import ProgressLoader from '../components/ProgressLoader';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

export default class OrderDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    var userObj = null;
    this.Login = strings('OrderDetailContainer.Login');
    this.OrderNo = strings('OrderDetailContainer.OrderNo');
    this.not = strings('OrderDetailContainer.not');
    this.Status = strings('OrderDetailContainer.Status');
    this.MinternetConnnection = strings('Messages.internetConnnection');

    orderItem = this.props.navigation.state.params.OrderItem;
    console.log('ORDER DETAIL ::::::::::::::::::: ', orderItem);
    this.state = {
      modelVisible: false,
      ratingText: '',
      orderDriverText: '',
      isLoading: false,
      getReviewData: [],
      reviewStar: 0,
    };
  }

  componentDidMount() {
    this.callApi_Getreview();
    this.checkUser();
  }

  checkUser() {
    getUserToken(
      success => {
        userObj = success;
      },
      failure => {
        showValidationAlert(this.Login);
      },
    );
  }
  onPressOrderFeedBack = text => {
    this.setState({
      modelVisible: true,
      orderDriverText: text,
    });
  };

  onPressDriverFeedBack = text => {
    this.setState({
      modelVisible: true,
      orderDriverText: text,
    });
  };
  onPressCloseModel = () => {
    this.clearAllState();
  };

  onChangeTextRating = text => {
    this.setState({
      ratingText: text,
    });
  };

  onPressSubmitRating = () => {
    const {orderDriverText, ratingText} = this.state;
    if (this.state.reviewStar !== 0) {
      getUserLoginData(
        success => {
          console.log('getUserLoginData', success);
          userId = success.UserID;
          if (orderDriverText == 'orderfeedback') {
            this.callApi_review(ORDER_REVIEW, userId);
          } else if (orderDriverText == 'driverfeedback') {
            this.callApi_review(DRIVER_REVIEW, userId);
          }
        },
        failure => {
          console.log('getUserLoginData', failure);
          this.clearAllState();
        },
      );
    } else {
      alert('Please fill all details');
    }
  };
  clearAllState() {
    this.setState({
      isLoading: false,
      ratingText: '',
      orderDriverText: '',
      modelVisible: false,
      reviewStar: 0,
    });
  }

  callApi_review(apiName, userId) {
    const {ratingText, reviewStar} = this.state;

    var param = {
      order_id: orderItem.order_id,
      user_id: userId,
      comments: ratingText,
      rating: reviewStar,
    };
    console.log('param:: ::', param);
    console.log('apiName:: ::', apiName);
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          apiName,
          param,
          response => {
            console.log('Response  review call api:: ::', response);
            this.clearAllState();
            this.callApi_Getreview();
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

  callApi_Getreview() {
    var OrderItem2 = this.props.navigation.state.params.OrderItem;
    console.log('OrderItem2', OrderItem2);
    var param = {
      order_id: orderItem ? orderItem.order_id : OrderItem2.order_id,
    };
    console.log('param:: ::', param);
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          GET_REVIEW,
          param,
          response => {
            console.log('Response  getreview call api:: ::', response);
            this.setState({
              getReviewData: response.data,
              isLoading: false,
            });
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
  render() {
    const {getReviewData} = this.state;
    return (
      <BaseContainer
        title={strings('OrderDetailContainer.OrderDetail')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        <Modal
          visible={this.state.modelVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => this.onPressCloseModel()}>
          <View style={styles.modalContainer}>
            {this.state.isLoading ? <ProgressLoader /> : null}
            <View style={styles.modalSubContainer}>
              <View style={{flexDirection: 'row', height: 20}}>
                <Text
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: 'Satisfy-Regular',
                    color: EDColors.primary,
                    fontSize: 22,
                  }}>
                  Give Your Review
                </Text>
                <TouchableOpacity onPress={() => this.onPressCloseModel()}>
                  <Image
                    style={{alignSelf: 'center', height: 15, width: 15}}
                    source={Assets.ic_close}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View>
                  <View
                    style={{
                      alignSelf: 'center',
                    }}>
                    <Rating
                      type="custom"
                      // ratingImage={Assets.rating}
                      ratingColor={EDColors.primary}
                      ratingBackgroundColor={EDColors.offWhite}
                      ratingCount={5}
                      imageSize={30}
                      onFinishRating={star => {
                        this.setState({
                          reviewStar: star,
                        });
                      }}
                      style={{paddingVertical: 10}}
                      startingValue={0}
                    />
                  </View>
                  <TextInput
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      textAlignVertical: 'top',
                      height: 100,
                      color: '#000',
                    }}
                    placeholderTextColor="#C7C7CD"
                    onChangeText={text => this.onChangeTextRating(text)}
                    multiline={true}
                    value={this.state.ratingText}
                    numberOfLines={5}
                    maxLength={400}
                  />
                </View>

                <View style={{alignSelf: 'center'}}>
                  <EDThemeButton
                    label={'SUBMIT'}
                    buttonWidth={100}
                    fontSizeNew={5}
                    onPress={() => this.onPressSubmitRating()}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
        // showsVerticalScrollIndicator={false}
        // style={{ marginBottom: 10 }}
        >
          <View style={{flex: 1}}>
            <View
              style={{
                borderRadius: 6,
                backgroundColor: EDColors.white,
                margin: 10,
                padding: 2,
                shadowColor: 'gray',
                shadowOpacity: 0.4,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 6,
                elevation: 5,
              }}>
              <View
                style={{
                  margin: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: EDColors.black,
                    fontSize: 16,
                    fontFamily: ETFonts.regular,
                  }}>
                  {this.OrderNo + '-' + orderItem.order_id}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginLeft: 5,
                    marginRight: 5,
                    fontFamily: ETFonts.regular,
                  }}>
                  {funGetDateStr(orderItem.order_date, 'DD-MMM')}
                </Text>

                <EDThemeButton
                  label={strings('OrderDetailContainer.REORDER')}
                  buttonWidth={100}
                  fontSizeNew={5}
                  onPress={() => {
                    if (orderItem.timings.closing.toLowerCase() !== 'open') {
                      showDialogue(this.not, [], '');
                    } else {
                      this.storeData(orderItem);
                    }
                  }}
                />
              </View>
              <Text
                style={{
                  margin: 5,
                  textAlign: 'left',
                  color: EDColors.black,
                  fontSize: 15,
                  fontFamily: ETFonts.regular,
                }}>
                {this.Status + ' : ' + orderItem.order_status}
              </Text>
              <FlatList
                data={orderItem.items}
                listKey={(item, index) => 'Q' + index.toString()}
                renderItem={({item, index}) => {
                  // console.log('item==>', item);
                  // console.log('item==>', item.addons);
                  var noOfAddons = item.addons.length;

                  return (
                    <View style={{flex: 1, textAlign: 'left'}}>
                      <OrderItem
                        itemImage={item.image}
                        itemName={item.name}
                        quantity={
                          strings('OrderDetailContainer.Qty') +
                          ':' +
                          item.quantity
                        }
                        // price={item.price}
                        price={INR_SIGN + ' ' + item.price}
                        isVeg={item.is_veg}
                        noOfAddons={noOfAddons}
                        addOnsData={item}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => item + index}
              />
            </View>
            <View
              style={{
                borderRadius: 6,
                backgroundColor: EDColors.white,
                marginLeft: 10,
                marginRight: 10,
                padding: 2,
              }}>
              <Text
                style={{
                  margin: 5,
                  textAlign: 'left',
                  color: EDColors.black,
                  fontSize: 15,
                  fontFamily: ETFonts.regular,
                }}>
                {strings('OrderDetailContainer.AmountPaid')}
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    backgroundColor: EDColors.black,
                    height: 0.5,
                    flex: 1,
                    alignSelf: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                />
              </View>

              <FlatList
                data={orderItem.price}
                listKey={(item, index) => 'Q' + index.toString()}
                renderItem={({item, index}) => {
                  console.log('item', item);
                  return (
                    <View style={{flex: 1}}>
                      <PriceDetail
                        title={item.label}
                        price={
                          item.label.includes('total') ||
                          item.label.includes('Total')
                            ? INR_SIGN + ' ' + item.value
                            : // ? item.value
                              item.value
                        }
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => item + index}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderRadius: 6,
                backgroundColor: EDColors.white,
                marginLeft: 10,
                marginRight: 10,
                padding: 2,
                margin: 10,
                padding: 5,
              }}>
              <EDThemeButton
                label={strings('OrderDetailContainer.OrderFeedback')}
                buttonWidth={150}
                fontSizeNew={5}
                onPress={() => this.onPressOrderFeedBack('orderfeedback')}
              />
              <EDThemeButton
                label={strings('OrderDetailContainer.DriverFeedback')}
                buttonWidth={150}
                fontSizeNew={5}
                onPress={() => this.onPressDriverFeedBack('driverfeedback')}
              />
            </View>
            {getReviewData.length > 0 && (
              <View
                style={{
                  borderRadius: 6,
                  backgroundColor: EDColors.white,
                  marginLeft: 10,
                  marginRight: 10,
                  margin: 10,
                  padding: 5,
                }}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontWeight: '700',
                    }}>
                    {strings('OrderDetailContainer.OrderRating')}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: EDColors.placeholder,
                      marginTop: 5,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        width: '85%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: getReviewData[0].review_comments
                            ? 'black'
                            : EDColors.placeholder,
                        }}>
                        {getReviewData[0].review_comments
                          ? getReviewData[0].review_comments
                          : 'Waiting For your Comments'}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '15%',
                        padding: 5,
                        alignItems: 'flex-end',
                      }}>
                      <View
                        style={{
                          borderRadius: 10,
                          height: 25,
                          width: 40,
                          backgroundColor: EDColors.paleBlue,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          borderColor: EDColors.secondary,
                          borderWidth: 1,
                        }}>
                        <Text style={{fontSize: 15}}>
                          {getReviewData[0].review_rating
                            ? getReviewData[0].review_rating
                            : '0'}
                        </Text>
                        <Icon name="star" color={EDColors.primary} size={15} />
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontWeight: '700',
                      marginTop: 5,
                    }}>
                    {strings('OrderDetailContainer.DriverRating')}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: EDColors.placeholder,
                      marginTop: 5,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        width: '85%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: getReviewData[0].review_driver_commments
                            ? 'black'
                            : EDColors.placeholder,
                        }}>
                        {getReviewData[0].review_driver_commments
                          ? getReviewData[0].review_driver_commments
                          : 'Waiting For your Comments'}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '15%',
                        padding: 5,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: 10,
                          height: 25,
                          width: 40,
                          backgroundColor: EDColors.paleBlue,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          borderColor: EDColors.secondary,
                          borderWidth: 1,
                        }}>
                        <Text style={{fontSize: 15}}>
                          {getReviewData[0].review_driver_rating
                            ? getReviewData[0].review_driver_rating
                            : '0'}
                        </Text>
                        <Icon name="star" color={EDColors.primary} size={15} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </BaseContainer>
    );
  }

  storeData(data) {
    console.log('data reorder', data);
    var cartData = {};

    getCartList(
      success => {
        if (success.items.length === 0) {
          clearCartData(success => {
            var itemdata = data.items.map((item, index) => {
              var addonsString = '';
              item.addons.map((item2, index) => {
                addonsString = addonsString.concat(item2.entity_id + ',');
              });
              item['addons'] = addonsString;
              console.log('final item', item);
            });
            cartData = {
              resId: data.restaurant_id,
              items: data.items,
              coupon_name: '',
              cart_id: 0,
            };
            console.log('reorder save data :: :: ::', cartData);
            this.saveData(cartData);
          });
        } else {
          showValidationAlert(CART_PENDING_ITEMS);
        }
      },
      onCartNotFound => {
        var itemdata = data.items.map((item, index) => {
          var addonsString = '';
          item.addons.map((item2, index) => {
            addonsString = addonsString.concat(item2.entity_id + ',');
          });
          item['addons'] = addonsString;
          console.log('final item', item);
        });
        cartData = {
          resId: data.restaurant_id,
          items: data.items,
          coupon_name: '',
          cart_id: 0,
        };
        console.log('reorder oncartnotfound :: :: ::', cartData);
        this.saveData(cartData);
      },
      error => {},
    );
  }

  saveData(data) {
    saveCartData(
      data,
      success => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('CartContainer');
      },
      fail => {},
    );
  }
}
export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height / 2.3,
    marginTop: 20,
    marginBottom: 20,
  },
});

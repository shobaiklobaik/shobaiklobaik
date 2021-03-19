import React from 'react';
import {
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import {
  RESPONSE_SUCCESS,
  ORDER_LISTING,
  funGetDateStr,
  INR_SIGN,
  capiString,
} from '../utils/Constants';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {apiPost} from '../api/ServiceManager';
import ProgressLoader from '../components/ProgressLoader';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import {ETFonts} from '../assets/FontConstants';
import OrderStatusCard from '../components/OrderStatusCard';
import PriceDetail from '../components/PriceDetail';
import metrics from '../utils/metrics';
import {connect} from 'react-redux';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {netStatus} from '../utils/NetworkStatusConnection';
import {NavigationEvents} from 'react-navigation';
import NavigationService from '../../NavigationService';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

class MyOrderContainer extends React.Component {
  state = {
    language: '',
    isLoading: false,
    selectedIndex: 0,
    isEnable: false,
  };

  arrayUpcoming = [];

  constructor(props) {
    super(props);

    this.checkoutDetail = this.props.checkoutDetail;
    var userObj = null;

    this.CheckLanguage();

    this.OrderDetails = strings('MyOrderContainer.OrderDetails');
    this.ItemOrdered = strings('MyOrderContainer.ItemOrdered');
    this.ItemsOrdered = strings('MyOrderContainer.ItemsOrdered');
    this.InProcess = strings('MyOrderContainer.InProcess');
    this.PastOrders = strings('MyOrderContainer.PastOrders');
    this.Placed = strings('MyOrderContainer.Placed');
    this.preparing = strings('MyOrderContainer.preparing');
    this.Ontheway = strings('MyOrderContainer.Ontheway');
    this.delivered = strings('MyOrderContainer.delivered');

    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.MnoOrderMsg = strings('Messages.noOrderMsg');
  }
  updateData(arrayItems) {
    var arrayFinal = [];
    arrayItems.map((item, index) => {
      arrayFinal[index] = {
        title: this.OrderDetails + '(#' + item.order_id + ')',
        data: [item],
        index: index,
        isShow: false,
      };
    });

    this.arrayUpcoming = arrayFinal;
  }

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index,
    });
  };

  componentDidMount() {
    console.log('MY PROPS VALUE :::::::::::::::::::: ', this.props);
    // this.props.navigation.state.params !== undefined ? this.loadData(success) : null
    this.props.saveNavigationSelection('Order');
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
  checkUser() {
    getUserToken(
      success => {
        userObj = success;

        this.loadData(success);
        // this.getData(success);
      },
      failure => {
        showValidationAlert(this.MloginValidation);
      },
    );
  }

  loadData(userObj) {
    // console.log ("load data called")
    // var clearId = setTimeout(() => {
    this.getData(userObj);
    // }, 60 * 1000);
    // this.setState({ clearId: clearId});
  }

  getData(userObj) {
    // netStatus(status => {
    //   if (status) {
    this.setState({isLoading: true});
    apiPost(
      ORDER_LISTING,
      {
        language: this.state.language,
        user_id: parseInt(userObj.UserID) || 0,
        token: '' + userObj.PhoneNumber,
      },
      resp => {
        console.log('ORDER DETAIL LIST ::::::::::::: ', resp);
        if (resp != undefined) {
          if (resp.status == RESPONSE_SUCCESS) {
            console.log('get new data');
            this.arrayUpcoming = resp.in_process.in_process;
            this.updateData(this.arrayUpcoming);
            this.arrayPast = resp.past.past;
            this.setState({isLoading: false});
          } else {
            showValidationAlert(resp.message);
            this.setState({isLoading: false});
          }
        } else {
          showValidationAlert(this.MgeneralWebServiceError);
          this.setState({isLoading: false});
        }
      },
      err => {
        this.setState({isLoading: false});
        // showValidationAlert(Messages.internetConnnection);
      },
    );
    //   } else {
    //     showValidationAlert(Messages.internetConnnection);
    //   }
    // });
  }

  itemHeader(orderData, index, isShow) {
    // console.log("HEADER ITEM DATA ::::::::: ", orderData, "  :::::::  ", this.arrayUpcoming[index])
    if (this.arrayUpcoming != undefined && this.arrayUpcoming.length > 0) {
      // console.log('arrayUpcoming', this.arrayUpcoming);
      return (
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              marginTop: 5,
              backgroundColor: EDColors.white,
              flexDirection: 'row',
              padding: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: EDColors.primary,
                fontSize: 18,
                fontFamily: ETFonts.regular,
              }}>
              {funGetDateStr(
                this.arrayUpcoming[index].data[0].order_date,
                'DD-MMM',
              )}
            </Text>
            <Text
              style={{
                flex: 1,
                color: EDColors.black,
                fontSize: 18,
                fontFamily: ETFonts.regular,
                marginLeft: 10,
              }}>
              {(this.arrayUpcoming[index].data[0].items != undefined &&
              this.arrayUpcoming[index].data[0].items.length > 0
                ? this.arrayUpcoming[index].data[0].items.length
                : 0) +
                (this.arrayUpcoming[index].data[0].items.length == 1
                  ? this.ItemOrdered
                  : this.ItemsOrdered)}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: ETFonts.regular,
              }}>
              {INR_SIGN + ' ' + this.arrayUpcoming[index].data[0].total}
              {/* {"\u20B9 " + this.arrayUpcoming[index].data[0].total} */}
            </Text>
            <Text />
          </View>
          <View style={{flex: 1}}>
            <FlatList
              style={{marginTop: 5}}
              data={
                this.arrayUpcoming[index].data[0].order_status != undefined &&
                this.arrayUpcoming[index].data[0].order_status.length > 0
                  ? this.getDataFromStatus(
                      this.arrayUpcoming[index].data[0].order_status,
                      this.arrayUpcoming[index].data[0].placed,
                      this.arrayUpcoming[index].data[0].preparing,
                      this.arrayUpcoming[index].data[0].onGoing,
                      this.arrayUpcoming[index].data[0].delivered,
                    )
                  : []
              }
              horizontal={true}
              renderItem={({item, index}) => {
                return !item.isLine ? (
                  <View style={{flex: 1}}>
                    <OrderStatusCard
                      image={item.image}
                      text={item.time}
                      heading={item.orderStatusText}
                      lines={0}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: item.isComplete
                        ? EDColors.primary
                        : EDColors.black,
                      height: 0.5,
                      flex: 1,
                      width: (metrics.screenWidth - 20) / 7 - 4,
                      alignSelf: 'flex-end',
                      marginBottom: 30,
                    }}
                  />
                );
              }}
              keyExtractor={(item, index) => item + index}
            />
          </View>

          <View style={{flex: 1}}>
            {this.arrayUpcoming[index].data[0].delivery_flag === 'delivery' &&
            this.arrayUpcoming[index].data[0].onGoing !== '' ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: EDColors.primary,
                  borderRadius: 5,
                  marginTop: 10,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={() =>
                  this.props.navigation.navigate('TrackOrderContainer', {
                    trackOrder: this.arrayUpcoming[index],
                  })
                }>
                <Text
                  style={{
                    marginVertical: 10,
                    fontSize: 18,
                    color: EDColors.white,
                  }}>
                  {strings('MyOrderContainer.TrackYourOrder')}
                  {/* Track your Order */}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={1.0}
            style={styles.itemContainer}
            onPress={() => {
              console.log('show and close');
              if (isShow) {
                this.arrayUpcoming[index].isShow = false;
                this.setState({
                  isEnable: this.state.isEnable ? false : true,
                });
              } else {
                this.arrayUpcoming[index].isShow = true;
                this.setState({
                  isEnable: this.state.isEnable ? false : true,
                });
              }
            }}>
            <Text style={styles.itemTitle}>{orderData}</Text>
            <Image
              style={styles.rightImage}
              source={isShow ? Assets.ic_down_arrow : Assets.ic_up_arrow}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  getDataFromStatus(
    status,
    preparingTime,
    placedTime,
    onGoingTime,
    deliveredTime,
  ) {
    currentOrderStatus = [
      {
        image: Assets.orderplacedselected,
        isLine: false,
        isComplete: false,
        time: preparingTime,
        orderStatusText: this.Placed,
      },
      {
        image: '',
        isLine: true,
        isComplete: status.toLowerCase() === this.Placed ? false : true,
        time: '',
        orderStatusText: '',
      },
      {
        image:
          status.toLowerCase() === this.Placed
            ? Assets.preparingdeselected
            : Assets.preparingselected,
        isLine: false,
        isComplete: false,
        time: placedTime,
        orderStatusText: this.preparing,
      },
      {
        image: '',
        isLine: true,
        isComplete:
          status.toLowerCase() === this.Placed ||
          status.toLowerCase() === this.preparing
            ? false
            : true,
        time: '',
        orderStatusText: '',
      },
      {
        image:
          status.toLowerCase() === this.Placed ||
          status.toLowerCase() === this.preparing
            ? Assets.onthewaydeselected
            : Assets.onthewayselected,
        isLine: false,
        isComplete: false,
        time: onGoingTime,
        orderStatusText: this.Ontheway,
      },
      {
        image: '',
        isLine: true,
        isComplete: status.toLowerCase() === this.delivered ? true : false,
        time: '',
        orderStatusText: '',
      },
      {
        image:
          status.toLowerCase() === this.delivered
            ? Assets.deliveredselected
            : Assets.delivereddeselected,
        isLine: false,
        isComplete: false,
        time: deliveredTime,
        orderStatusText: this.delivered,
      },
    ];
    return currentOrderStatus;
  }

  nestedItem(data, index, section) {
    console.log('NESTED DATA ::::::::: ', data, '  ::::::::::::  ', section);
    return (
      <View style={styles.nestedContainer}>
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data.items}
            listKey={(item, index) => 'D' + index.toString()}
            renderItem={({item, index}) => {
              console.log('addons', item.addons);
              return (
                <View style={{flex: 1}}>
                  <PriceDetail
                    title={capiString(item.name) + ' (x' + item.quantity + ')'}
                    // price={item.itemTotal}
                    price={INR_SIGN + ' ' + item.itemTotal}
                  />
                  {item.addons.map((item, index) => {
                    return (
                      <View style={styles.container}>
                        <Text style={styles.itemTitle}>{item.addons_name}</Text>
                        <Text style={styles.price}>
                          {INR_SIGN + ' ' + item.price}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            }}
            keyExtractor={(item, index) => item + index}
          />

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
            data={data.price}
            listKey={(item, index) => 'Q' + index.toString()}
            renderItem={({item, index}) => {
              return (
                <View style={{flex: 1}}>
                  <PriceDetail
                    title={capiString(item.label)}
                    price={
                      item.label.includes('total') ||
                      item.label.includes('Total') ||
                      item.label.includes('Discount')
                        ? // ? item.value
                          INR_SIGN + ' ' + item.value
                        : item.value
                    }
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <BaseContainer
        title={strings('MyOrderContainer.Order')}
        left="Menu"
        right={[]}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}>
        <NavigationEvents
          onWillFocus={payload => {
            console.log('Call will Focus :::::::::::::::::::: ');
          }}
          onDidFocus={payload => {
            this.checkUser();
            console.log('did focus called');
          }}
          onWillBlur={payload => {
            console.log('Call will Blur ::::::::::::: ');
          }}
          onDidBlur={payload => {
            // this.stopTimer();
            console.log('will blur called');
          }}
        />
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{flex: 1, margin: 10}}>
          <SegmentedControlTab
            values={[this.InProcess, this.PastOrders]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            backgroundColor={EDColors.primary}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
            allowFontScaling={false}
            borderColor={EDColors.primary}
          />
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={{}}>
              {this.state.selectedIndex == 0 ? (
                <View style={{flex: 1}}>
                  {this.arrayUpcoming != undefined &&
                  this.arrayUpcoming != null &&
                  this.arrayUpcoming.length > 0 ? (
                    <SectionList
                      showsVerticalScrollIndicator={false}
                      extraData={this.state}
                      renderSectionHeader={({
                        section: {title, index, isShow},
                      }) => {
                        return title != '' ? (
                          this.itemHeader(title, index, isShow)
                        ) : (
                          <View />
                        );
                      }}
                      sections={this.arrayUpcoming}
                      renderItem={({item, index, section}) => {
                        if (section.isShow) {
                          return this.nestedItem(item, index, section);
                        } else {
                          return null;
                        }
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : this.state.isLoading ? (
                    <View />
                  ) : (
                    <DataNotAvailableContainer text={this.MnoOrderMsg} />
                  )}
                </View>
              ) : (
                <View style={{flex: 1}}>
                  {this.arrayPast != undefined &&
                  this.arrayPast != null &&
                  this.arrayPast.length > 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={this.arrayPast}
                      renderItem={({item, index}) => {
                        return (
                          <TouchableOpacity
                            style={{flex: 1}}
                            onPress={() => {
                              this.props.navigation.navigate(
                                'OrderDetailContainer',
                                {
                                  OrderItem: item,
                                },
                              );
                            }}>
                            <View
                              style={{
                                flex: 1,
                                marginTop: 8,
                                backgroundColor: EDColors.white,
                                flexDirection: 'row',
                                paddingLeft: 5,
                                paddingRight: 5,
                                paddingTop: 8,
                                paddingBottom: 8,
                                borderRadius: 5,
                              }}>
                              <Text
                                style={{
                                  color: EDColors.primary,
                                  fontSize: 18,
                                  fontFamily: ETFonts.regular,
                                }}>
                                {funGetDateStr(item.order_date, 'DD-MMM')}
                              </Text>
                              <Text
                                style={{
                                  flex: 1,
                                  color: EDColors.black,
                                  fontSize: 18,
                                  fontFamily: ETFonts.regular,
                                  marginLeft: 10,
                                }}>
                                {(item.items != undefined &&
                                item.items.length > 0
                                  ? item.items.length
                                  : 0) + this.ItemsOrdered}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: ETFonts.regular,
                                }}>
                                {INR_SIGN + ' ' + item.total}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : (
                    <DataNotAvailableContainer />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    return {
      titleSelected: state.navigationReducer.selectedItem,
      checkoutDetail: state.checkoutReducer.checkoutDetail,
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
    };
  },
)(MyOrderContainer);

const styles = StyleSheet.create({
  itemContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    margin: 5,
    padding: 4,
    borderRadius: 4,
    backgroundColor: EDColors.primary,
  },
  itemTitle: {
    flex: 3,
    color: '#fff',
    padding: 10,
    fontFamily: ETFonts.regular,
    fontSize: 18,
  },
  rightImage: {
    alignSelf: 'center',
    marginEnd: 10,
  },
  nestedContainer: {
    borderRadius: 6,
    backgroundColor: EDColors.white,
    marginLeft: 15,
    marginRight: 15,
    padding: 2,
    flex: 1,
  },
  tabsContainerStyle: {
    //custom styles
    backgroundColor: EDColors.primary,
    alignSelf: 'flex-start',
  },
  tabStyle: {
    //custom styles
    backgroundColor: EDColors.white,
    borderColor: EDColors.primary,
    alignSelf: 'flex-start',
  },
  tabTextStyle: {
    //custom styles
    color: EDColors.primary,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-start',
  },
  activeTabStyle: {
    //custom styles
    backgroundColor: EDColors.primary,
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  price: {
    fontFamily: ETFonts.regular,
    fontSize: 15,
  },
  itemTitle: {
    flex: 1,
    fontFamily: ETFonts.regular,
    textAlign: 'left',
    fontSize: 15,
  },
});

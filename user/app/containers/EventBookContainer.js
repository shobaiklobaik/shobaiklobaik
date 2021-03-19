import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import BaseContainer from './BaseContainer';
import EDThemeButton from '../components/EDThemeButton';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  funGetTime,
  funGetDate,
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  CHECK_BOOKING_AVAIL,
  BOOKING_EVENT,
  funGetTomorrowDate,
} from '../utils/Constants';
import RestaurantOverview from '../components/RestaurantOverview';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import PackageContainer from '../components/PackageContainer';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {apiPost} from '../api/ServiceManager';
import ReviewContainer from '../components/ReviewContainer';
import ProgressLoader from '../components/ProgressLoader';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
import {ETFonts} from '../assets/FontConstants';
//import { Messages } from "../utils/Messages";
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

export default class EventBookContainer extends React.PureComponent {
  dataObj = this.props.navigation.state.params.data;

  state = {
    language: '',
    isLoading: false,
    personVal: 1,
    eventTime: '',
    eventDate: '',
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    selectedIndex: 0,
    selectedPackage: -1,
    selectedPackageId: '',
    modelVisible: false,
    modelText: '',
    isPositive: true,
  };
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MaddPeopleValidation = strings('Messages.addPeopleValidation');
    this.MdiningTimeValidation = strings('Messages.diningTimeValidation');
    this.MdiningDateValidation = strings('Messages.diningDateValidation');
    this.CheckLanguage();

    this.People = strings('EventBookContainer.People');
    this.Peoples = strings('EventBookContainer.Peoples');
    this.Reviews = strings('EventBookContainer.Reviews');
    this.Packages = strings('EventBookContainer.Packages');
  }

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

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index,
    });
  };

  componentDidMount() {
    netStatus(status => {
      if (status) {
        this.loadData();
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
  checkUser() {
    getUserToken(
      success => {
        userObj = success;

        this._checkBooking(success);
      },
      failure => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('InitialContainer');
      },
    );
  }

  checkData() {
    if (this.validateBooking()) {
      this.checkUser();
    }
  }

  _checkBooking(success) {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});

        apiPost(
          CHECK_BOOKING_AVAIL,
          {
            language: this.state.language,
            restaurant_id: parseInt(this.dataObj.restuarant_id) || 0,
            user_id: parseInt(success.UserID) || 0,
            token: '' + success.PhoneNumber,
            booking_date:
              '' + this.state.eventDate + ' ' + this.state.eventTime,
            package_id: this.state.selectedPackageId,
            people: this.state.personVal,
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.setState({
                  isLoading: false,
                  modelVisible: true,
                  isPositive: true,
                  modelText: resp.message,
                });
              } else {
                this.setState({
                  isLoading: false,
                  modelVisible: true,
                  isPositive: false,
                  modelText: resp.message,
                });
              }
            } else {
              this.setState({isLoading: false});
            }
          },
          err => {
            this.setState({isLoading: false});
            showValidationAlert(this.MinternetConnnection);
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }
  validateBooking() {
    if (this.state.personVal <= 0) {
      showValidationAlert(this.MaddPeopleValidation);
      return false;
    } else if (this.state.eventTime.trim() === '') {
      showValidationAlert(this.MdiningTimeValidation);
      return false;
    } else if (this.state.eventDate.trim() === '') {
      showValidationAlert(this.MdiningDateValidation);
      return false;
    }
    return true;
  }
  _confirmBooking(userObj) {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          BOOKING_EVENT,
          {
            language: this.state.language,
            restaurant_id: parseInt(this.dataObj.restuarant_id) || 0,
            user_id: parseInt(userObj.UserID) || 0,
            token: '' + userObj.PhoneNumber,
            booking_date:
              '' + this.state.eventDate + ' ' + this.state.eventTime,
            people: this.state.personVal,
            package_id: this.state.selectedPackageId,
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.props.navigation.navigate('BookingSuccess');
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
            showValidationAlert(this.MinternetConnnection);
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  loadData() {
    this.setState({isLoading: true});
    apiPost(
      GET_RESTAURANT_DETAIL,
      {
        language: this.state.language,
        restaurant_id: this.dataObj.restuarant_id,
      },
      resp => {
        if (resp != undefined) {
          if (resp.status == RESPONSE_SUCCESS) {
            this.arrayRestaurants = resp.restaurant;
            this.arrayReviews = resp.review;
            this.arrayPackages = resp.package;
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
        showValidationAlert(this.MinternetConnnection);
      },
    );
  }

  render() {
    return (
      <BaseContainer
        title={strings('EventBookContainer.BookingAvailability')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{flex: 1}}>
          <Modal
            visible={this.state.modelVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              this.setState({visible: false});
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.50)',
              }}>
              <View
                style={{
                  backgroundColor: EDColors.white,
                  margin: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <FastImage
                  style={{margin: 10}}
                  source={
                    this.state.isPositive
                      ? Assets.bookingavailable
                      : Assets.bookingnotavailable
                  }
                />
                <Text
                  style={{
                    color: EDColors.black,
                    fontSize: 20,
                    fontFamily: ETFonts.regular,
                    marginLeft: 10,
                  }}>
                  {this.state.modelText}
                </Text>
                <View style={{flexDirection: 'row', padding: 10}}>
                  {this.state.isPositive ? (
                    <EDThemeButton
                      label={strings('EventBookContainer.CONFIRM')}
                      buttonWidth={100}
                      style={{margin: 10}}
                      onPress={() => {
                        this._confirmBooking(userObj);
                        this.setState({modelVisible: false});
                      }}
                    />
                  ) : null}
                  <EDThemeButton
                    label={strings('EventBookContainer.CANCEL')}
                    borderButton={this.state.isPositive}
                    buttonWidth={100}
                    style={{margin: 10}}
                    onPress={() => {
                      this.setState({modelVisible: false});
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <ScrollView style={{flex: 1}}>
            <View>
              {this.arrayRestaurants != undefined ? (
                // <FastImage
                //   source={{uri: this.arrayRestaurants[0].image}}
                //   style={{width: '100%', height: 180}}
                // />
                <Image
                source={{uri: this.arrayRestaurants[0].image}}
                style={{width: '100%', height: 180}}
              />
              ) : null}
              <View
                style={{
                  position: 'relative',
                  marginTop: -50,
                }}>
                {this.arrayRestaurants != undefined ? (
                  <RestaurantOverview
                    resName={this.arrayRestaurants[0].name}
                    isShow={false}
                    review={this.arrayRestaurants[0].rating}
                    timing={
                      this.arrayRestaurants[0].timings.open +
                      '-' +
                      this.arrayRestaurants[0].timings.close
                    }
                    address={this.arrayRestaurants[0].address}
                    buttonText={this.arrayRestaurants[0].timings.off}
                    onButtonClick={str => {}}
                  />
                ) : null}
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 5,
                }}>
                <View style={{flex: 1, marginRight: 10}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      fontFamily: ETFonts.regular,
                      textAlign: 'left',
                      fontSize: 14,
                    }}>
                    {strings('EventBookContainer.HowManypeople')}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: 'bold',
                      color: '#000',
                      fontFamily: ETFonts.bold,
                      textAlign: 'left',
                      fontSize: 14,
                    }}>
                    {this.state.personVal > 0
                      ? this.state.personVal == 1
                        ? this.state.personVal + this.People
                        : this.state.personVal + this.Peoples
                      : null}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 5,
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      borderRadius: 10,
                      backgroundColor: EDColors.primary,
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (this.state.personVal > 0) {
                        this.setState({
                          personVal: this.state.personVal - 1,
                        });
                      }
                    }}>
                    <FastImage source={Assets.ic_minus} style={{margin: 5}} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      margin: 5,
                      borderRadius: 10,
                      backgroundColor: EDColors.primary,
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      if (this.state.personVal >= 0) {
                        this.setState({
                          personVal: this.state.personVal + 1,
                        });
                      }
                    }}>
                    <FastImage source={Assets.ic_plus} style={{margin: 5}} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  margin: 5,
                }}>
                <View style={{flex: 1, marginRight: 10}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      textAlign: 'left',
                      fontFamily: ETFonts.regular,
                    }}>
                    {strings('EventBookContainer.Dining')}
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
                  <TouchableOpacity onPress={this._showTimePicker}>
                    <View
                      style={{
                        margin: 4,
                        // borderRadius: 10,
                        alignSelf: 'center',
                      }}>
                      <FastImage
                        source={Assets.time}
                        style={{width: 18, height: 18}}
                      />
                    </View>
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    mode={'time'}
                    onConfirm={this._handleTimePicked}
                    onCancel={this._hideTimePicker}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  margin: 5,
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
                      color: '#000',
                      textAlign: 'left',
                      fontFamily: ETFonts.regular,
                    }}>
                    {strings('EventBookContainer.SelectDate')}
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
                  <TouchableOpacity onPress={this._showDatePicker}>
                    <View
                      style={{
                        borderRadius: 10,
                        margin: 2,
                      }}>
                      <Image source={Assets.calender} style={{margin: 5}} />
                    </View>
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={this.state.isDatePickerVisible}
                    mode={'date'}
                    minimumDate={funGetTomorrowDate()}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDatePicker}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                margin: 10,
              }}>
              <SegmentedControlTab
                values={[this.Reviews, this.Packages]}
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
              {this.state.selectedIndex == 0 ? (
                <View style={{flex: 1}}>
                  {this.arrayReviews != undefined &&
                  this.arrayReviews != null &&
                  this.arrayReviews.length > 0 ? (
                    <FlatList
                      data={this.arrayReviews}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        return (
                          <ReviewContainer
                            userImage={item.image}
                            name={item.first_name + ' ' + item.last_name}
                            rating={parseFloat(item.rating)}
                            size={15}
                            date="Jun 15"
                            review={item.review}
                            onReview={count => {}}
                            readonly={true}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : (
                    <DataNotAvailableContainer />
                  )}
                </View>
              ) : (
                <View style={{flex: 1}}>
                  {this.arrayPackages != undefined &&
                  this.arrayPackages != null &&
                  this.arrayPackages.length > 0 ? (
                    <FlatList
                      data={this.arrayPackages}
                      extraData={this.state.selectedPackage}
                      renderItem={({item, index}) => {
                        return (
                          <PackageContainer
                            pkgImage={item.image}
                            pkgName={item.name}
                            price={item.price}
                            pkgDesc={item.detail}
                            pkgAvailable={item.availability}
                            pos={index}
                            onPress={pos => {
                              this.setState({
                                selectedPackage: index,
                                selectedPackageId: item.package_id,
                              });
                            }}
                            isSelected={index == this.state.selectedPackage}
                            onReview={count => {}}
                          />
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
            <View
              style={{
                alignContent: 'flex-end',
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <EDThemeButton
                label={strings('EventBookContainer.CheckAvailability')}
                onPress={() => {
                  this.checkData();
                }}
              />
            </View>
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}

const styles = StyleSheet.create({
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
    fontFamily: ETFonts.regular,
    fontSize: 14,
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
});

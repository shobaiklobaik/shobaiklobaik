import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {
  GOOGLE_API_KEY,
  REGISTRATION_HOME,
  RESPONSE_SUCCESS,
  SEARCH_PLACEHOLDER,
  CHANGE_TOKEN,
} from '../utils/Constants';
import Assets from '../assets';
import BaseContainer from './BaseContainer';
import HomeCategoryCard from '../components/HomeCategoryCard';
import PopularRestaurantCard from '../components/PopularRestaurantCard';
import {apiPost} from '../api/ServiceManager';
import {EDColors} from '../assets/Colors';
import ETextViewNormalLable from '../components/ETextViewNormalLable';
import {getUserToken, getCartList} from '../utils/AsyncStorageHelper';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
import {connect} from 'react-redux';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import BannerImages from '../components/BannerImages';
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {netStatus} from '../utils/NetworkStatusConnection';
//import { Messages } from "../utils/Messages";
import {ETFonts} from '../assets/FontConstants';
import Geolocation from '@react-native-community/geolocation';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';
import firebase from 'react-native-firebase';
let Analytics = firebase.analytics();
import {AppEventsLogger} from 'react-native-fbsdk';

class MainContainer extends React.Component {
  constructor(props) {
    super(props);

    headerPhoneNum = '';
    strSearch = '';
    this.foodType = '';
    this.distance = '';
    this.modelSelected = '';
    this.showDialogue = strings('MainContainer.showDialogue');
    this.search = strings('MainContainer.Search');
    this.CheckLanguage();

    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    console.log('mainContainer::');
    // this.count = 0;
  }

  state = {
    language: '',
    latitude: 0.0,
    longitude: 0.0,
    error: null,
    isLoading: false,
    strAddress: null,
    isNetConnected: true,
    count: 0,
  };

  async componentDidMount() {
    Analytics.setAnalyticsCollectionEnabled(true);
    if (Platform.OS === 'android') {
      AppEventsLogger.logEvent('HomeScreen_Android');
      Analytics.setCurrentScreen('HomeScreen_Android', 'App');
    } else {
      AppEventsLogger.logEvent('HomeScreen_IOS');
      Analytics.setCurrentScreen('HomeScreen_IOS', 'App');
    }

    this.changeTokenAPI();
    getUserToken(
      success => {
        headerPhoneNum = success.PhoneNumber;
      },
      failure => {},
    );

    this.getLatLong();
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
  changeTokenAPI = () => {
    let params = {
      language: this.state.language,
      token: this.props.phoneNumber,
      user_id: this.props.userIdFromRedux,
      firebase_token: this.props.token,
    };
    apiPost(
      CHANGE_TOKEN,
      params,
      success => {
        console.log('Change Token success ::::::::::: ', success);
      },
      failure => {
        console.log('Change Token failure ::::::::::: ', failure);
      },
    );
  };

  getLatLong = () => {
    netStatus(status => {
      if (status) {
        if (GOOGLE_API_KEY !== '') {
          Geocoder.init(GOOGLE_API_KEY);
          this.setState({isLoading: true});
          Geolocation.getCurrentPosition(
            position => {
              console.log('main container latlong', position);
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });

              this.loadData(
                position.coords.latitude,
                position.coords.longitude,
                '',
              );
              console.log(
                'LATITUDE ::::::::::::::: ',
                position.coords.latitude,
              );
            },
            error => {
              console.log('ERRRORR :::::::::::::::::: ', error);
              this.setState({isLoading: false});
              this.setState({error: error.message});
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
          );
        } else {
          showDialogue(this.showDialogue, [], '');
        }
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  };

  loadData(lat, long, searchText) {
    let param = {
      language: this.state.language,
      latitude: lat,
      longitude: long,
      itemSearch: searchText,
      token: headerPhoneNum,
      food: '' + this.foodType,
      distance: '' + this.distance,
    };

    console.log('HOME PARAMETER :::::::::::: ', param);
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          REGISTRATION_HOME,
          param,
          resp => {
            console.log("resp---",resp)
            console.log("resp---",param)
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.arrayRestaurants = resp.restaurant;
                this.arrayCategories = resp.category;
                this.arraySlider = resp.slider;
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
            showValidationAlert(this.MgeneralWebServiceError);
            // showValidationAlert(err.message);
            console.log("err===",err)
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  testFunction = data => {
    this.foodType = data.food;
    this.distance = data.distance;

    this.loadData(this.state.latitude, this.state.longitude, '');
  };

  refreshScreen = () => {
    this.loadData(this.state.latitude, this.state.longitude, '');
  };

  rightClick = index => {
    if (this.state.count > 0) {
      if (index == 0) {
        this.props.navigation.navigate('CartContainer');
      } else if (index == 1) {
        this.props.navigation.navigate('Filter', {
          getFilterDetails: this.testFunction,
          filterType: 'Main',
          food: this.foodType,
          distance: this.distance,
        });
      }
    } else {
      if (index == 0) {
        this.props.navigation.navigate('Filter', {
          getFilterDetails: this.testFunction,
          filterType: 'Main',
          food: this.foodType,
          distance: this.distance,
        });
      }
    }
  };

  render() {
    this.props.navigation.addListener('didFocus', payload => {
      getCartList(
        success => {
          console.log('success', success);
          if (success != undefined) {
            console.log('success if', success);
            cartData = success.items;
            if (cartData.length > 0) {
              this.count = 0;
              cartData.map((item, index) => {
                console.log('count', this.count);
                this.count = this.count + item.quantity;
                console.log('count---->>>', this.count);
              });

              console.log('count final', this.count);
              this.setState({count: this.count});
              //this.props.saveCartCount(count);
            } else if (cartData.length == 0) {
              //this.props.saveCartCount(0);
              this.setState({count: 0});
            }
          } else {
          }
        },
        onCartNotFound => {},
        error => {},
      );
      this.props.saveNavigationSelection('Home');
    });

    return (
      <BaseContainer
        title={strings('MainContainer.Home')}
        left="Menu"
        //right={[{ url: Assets.ic_filter }]}
        right={
          this.state.count > 0
            ? [
                {
                  url: Assets.ic_cart,
                  name: 'Cart',
                  value: this.state.count,
                },
                {url: Assets.ic_filter, name: 'filter'},
              ]
            : [{url: Assets.ic_filter}]
        }
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}
        onRight={this.rightClick}
        loading={this.state.isLoading}>
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                {console.log('image array', this.arraySlider)}
                {this.arraySlider != undefined ? (
                  <BannerImages images={this.arraySlider} />
                ) : (
                  <Image
                    source={Assets.header_placeholder}
                    style={{
                      alignItems: 'center',
                      width: '100%',
                      height: 180,
                    }}
                  />
                )}

                <View
                  style={{
                    backgroundColor: 'white',
                    marginLeft: 15,
                    marginRight: 15,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                    marginTop: 155,
                  }}>
                  <View
                    style={{
                      paddingLeft: 5,
                      paddingRight: 5,
                      backgroundColor: EDColors.primary,
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomStartRadius: 5,
                      borderTopStartRadius: 5,
                    }}>
                    <Image source={Assets.ic_location} style={{margin: 10}} />
                  </View>

                  <View style={{flexDirection: 'row', paddingLeft: 5, flex: 1}}>
                    <TextInput
                      style={{
                        fontFamily: ETFonts.regular,
                        fontSize: 12,
                        color: '#000',
                      }}
                      placeholderTextColor="#C7C7CD"
                      numberOfLines={1}
                      placeholder={strings('MainContainer.Search')}
                      style={{
                        flex: 5,
                      }}
                      onChangeText={newText => {
                        this.strSearch = newText;
                      }}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      style={{
                        paddingRight: 8,
                      }}
                      onPress={() => {
                        this.loadData(
                          this.state.latitude,
                          this.state.longitude,
                          this.strSearch,
                        );
                        this.modelSelected = '';
                      }}>
                      <Image
                        source={Assets.ic_search}
                        resizeMode="contain"
                        style={{
                          flex: 1,
                          width: 20,
                          height: 20,
                          alignSelf: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <FlatList
              style={{marginTop: 30, marginStart: 10, marginEnd: 10}}
              horizontal
              extraData={this.state}
              data={this.arrayCategories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              renderItem={(item, index) => {
                return (
                  <HomeCategoryCard
                    categoryObjModel={item}
                    onPress={model => {
                      this.loadData(
                        this.state.latitude,
                        this.state.longitude,
                        item.item.name.replace("'",''),
                      );
                      this.modelSelected = item.item.name;
                    }}
                    isSelected={
                      this.modelSelected == item.item.name ? true : false
                    }
                  />
                );
              }}
            />

            {this.arrayRestaurants != undefined &&
            this.arrayRestaurants != null &&
            this.arrayRestaurants.length > 0 ? (
              <View>
                <ETextViewNormalLable
                  text={strings('MainContainer.PopularRestaurants')}
                />
                <FlatList
                  style={{margin: 5}}
                  data={this.arrayRestaurants}
                  extraData={this.state}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item + index}
                  renderItem={(item, index) => {
                    return (
                      <PopularRestaurantCard
                        restObjModel={item}
                        onPress={restObjModel => {
                          this.props.navigation.navigate(
                            'RestaurantContainer',
                            {
                              refresh: this.refreshScreen,
                              restId: restObjModel.restuarant_id,
                            },
                          );
                        }}
                      />
                    );
                  }}
                />
              </View>
            ) : this.arrayRestaurants != undefined &&
              this.arrayRestaurants != null &&
              this.arrayRestaurants.length == 0 ? (
              <DataNotAvailableContainer />
            ) : (
              // <View />
              <View style={{flex: 1}}>
                {this.state.isLoading ? null : (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      backgroundColor: EDColors.primary,
                      padding: 10,
                      marginVertical: 100,
                    }}
                    onPress={() => this.getLatLong()}>
                    {/* <Image
                    source = {Assets.refresh}/> */}
                    <Text style={{color: EDColors.white}}>
                      {strings('MainContainer.Reload')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    return {
      userIdFromRedux: state.userOperations.userIdInRedux,
      token: state.userOperations.token,
      phoneNumber: state.userOperations.phoneNumberInRedux,
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
    };
  },
)(MainContainer);

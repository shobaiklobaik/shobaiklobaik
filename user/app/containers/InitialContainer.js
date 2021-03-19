import React from 'react';
import {View, Image, Platform, AppState, Linking, Alert} from 'react-native';
import Assets from '../assets';
import {PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {getUserToken, getUserFCM} from '../utils/AsyncStorageHelper';
import {StackActions, NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {
  saveUserDetailsInRedux,
  saveUserFCMInRedux,
  saveCountryCodeInRedux,
} from '../redux/actions/User';
import {
  ORDER_TYPE,
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  COUNTRY_CODE_URL,
} from '../utils/Constants';
import NavigationService from '../../NavigationService';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
import {isLocationEnable} from '../utils/LocationCheck';
import {apiGet} from '../api/ServiceManager';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';

var redirectType = '';

class InitialContainer extends React.Component {
  constructor(props) {
    super(props);

    this.userObj = undefined;
    redirectType = this.props.screenProps;
    this.isOpenSetting = false;
  }

  state = {
    isRefresh: false,
    appState: AppState.currentState,
  };

  componentDidMount() {
    // this.getCountryCode()
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (Platform.OS == 'android') {
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }
  }

  _handleAppStateChange = nextAppState => {
    console.log('app state', nextAppState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');

      if (this.isOpenSetting == true) {
        console.log('get back result successs');
        this.checkLocationIOS();
      }
    }
    this.setState({appState: nextAppState});
  };

  getCountryCode = () => {
    apiGet(
      COUNTRY_CODE_URL,
      onSuccess => {
        this.props.saveCountryCode(onSuccess.data.phone_code);
      },
      onFailure => {},
    );
  };

  async componentWillMount() {
    console.log('Will Mount ::::::::::');
    if (Platform.OS == 'android') {
      isLocationEnable(
        success => {
          console.log('success');
          requestLocationPermission(this.props);
        },
        error => {
          console.log('error');
          showValidationAlert('Please allow location access from setting');
        },
        backPress => {
          console.log(backPress);
        },
      );
    } else {
      this.checkLocationIOS();
    }
  }

  checkLocationIOS() {
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
              console.log('ios GRANTED -2');
            });
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
              console.log('ios GRANTED -2');
            });
            break;
          case RESULTS.GRANTED:
            requestLocationPermission(this.props);
            console.log('ios GRANTED');
            break;
          case RESULTS.BLOCKED:
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
              console.log('ios GRANTED -2');
            });
            break;
        }
      })
      .catch(error => {
        // …
      });
    // Geolocation.getCurrentPosition(
    //   () => {
    //     console.log('ios GRANTED');
    //     requestLocationPermission(this.props);
    //   },
    //   () => {
    //     console.log('ios DENIED');
    //     request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
    //       console.log('ios GRANTED -2');
    //     });
    //     // Alert.alert(
    //     //   'Alert',
    //     //   'Please allow location access from setting',
    //     //   [
    //     //     {
    //     //       text: 'OK',
    //     //       onPress: () => {
    //     //         this.isOpenSetting = true;
    //     //         Linking.openURL('app-settings:');
    //     //       },
    //     //     },
    //     //     {
    //     //       text: 'Cancel',
    //     //       onPress: () => console.log('No button clicked'),
    //     //       style: 'cancel',
    //     //     },
    //     //   ],
    //     //   {
    //     //     cancelable: true,
    //     //   },
    //     // );
    //     // Alert.alert('Please allow location access from setting', [
    //     //   {
    //     //     text: 'OK',
    //     //     onPress: () => {
    //     //       this.isOpenSetting = true;
    //     //       Linking.openURL('app-settings:');
    //     //     },
    //     //   },
    //     // ]);
    //   },
    // );
  }

  render() {
    this.props.navigation.addListener('didFocus', payload => {
      if (redirectType == undefined) {
        redirectType = DEFAULT_TYPE;
        _checkData(this.props);
        // this.setState({ isRefresh: this.state.isRefresh ? false : true });
      }
    });

    return (
      <View style={{flex: 1}}>
        <FastImage
          source={Assets.bgHome}
          resizeMode={'cover'}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      </View>
    );
  }
}

export async function requestLocationPermission(prop) {
  if (Platform.OS == 'ios') {
    console.log('Go to Splashscre ::::::::::::');
    _checkData(prop);
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Shobaik Lobaik User',
        message: 'Allow Shobaik Lobaik User to access your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      _checkData(prop);
    } else {
    }
  } catch (err) {
    console.error("errr==>",err);
  }
}

export function _checkData(props) {
  setTimeout(() => {
    getUserToken(
      success => {
        if (
          success != undefined &&
          success.PhoneNumber != '' &&
          success.PhoneNumber != undefined
        ) {
          props.saveCredentials(success);

          if (redirectType === ORDER_TYPE) {
            redirectType = undefined;

            NavigationService.navigate('Order');
          } else if (redirectType === NOTIFICATION_TYPE) {
            redirectType = undefined;

            NavigationService.navigate('Notification');
          } else {
            getUserFCM(
              success => {
                props.saveToken(success);
                props.navigation.dispatch(
                  StackActions.reset({
                    index: 0,
                    actions: [
                      //       NavigationActions.navigate({ routeName: "MainContainer" })
                      NavigationActions.navigate({routeName: 'MainContainer'}),
                    ],
                  }),
                );
              },
              failure => {},
            );
          }
        } else {
          console.log('Go to Splashscreen1');
          props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({routeName: 'SplashContainer'}),
              ],
            }),
          );
        }
      },
      failure => {
        console.log('Go to Splashscreen1');
        props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'SplashContainer'}),
            ],
          }),
        );
      },
    );

    if (
      this.userObj != undefined &&
      this.userObj.PhoneNumber != '' &&
      this.userObj.PhoneNumber != undefined
    ) {
    } else {
    }
  }, 3000);
}

export default connect(
  state => {
    return {};
  },
  dispatch => {
    return {
      saveCredentials: detailToSave => {
        dispatch(saveUserDetailsInRedux(detailToSave));
      },
      saveToken: token => {
        dispatch(saveUserFCMInRedux(token));
      },
      saveCountryCode: code => {
        dispatch(saveCountryCodeInRedux(code));
      },
    };
  },
)(InitialContainer);

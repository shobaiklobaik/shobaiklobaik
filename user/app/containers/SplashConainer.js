import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Platform,
  StatusBar,
} from 'react-native';
import Assets from '../assets';
import EDThemeButton from '../components/EDThemeButton';
import {showNotImplementedAlert} from '../utils/CMAlert';
import EDSkipButton from '../components/EDSkipButton';
import LoginContainer from './LoginContainer';
import {PermissionsAndroid} from 'react-native';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {StackActions, NavigationActions} from 'react-navigation';
// import {
//   LoginButton,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk';
// import {LoginManager} from 'react-native-fbsdk';
import {SocialIcon} from 'react-native-elements';
import {strings} from '../locales/i18n';
import FastImage from 'react-native-fast-image';
import {AppEventsLogger} from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
let Analytics = firebase.analytics();

export default class SplashContainer extends React.Component {
 
  constructor(props) {
    super(props);
    this.title = strings('splash.permission_title');
    this.message = strings('splash.permission_message');
    Analytics.setAnalyticsCollectionEnabled(true);
    if (Platform.OS == 'android') {
      AppEventsLogger.logEvent('SplashScreen_Android');
      Analytics.setCurrentScreen('SplashScreen_Android', 'App');
    } else {
      AppEventsLogger.logEvent('SplashScreen_IOS');
      Analytics.setCurrentScreen('SplashScreen_IOS', 'App');
    }
  }

  componentDidMount() {
    getUserToken(success => {}, failure => {});
  }

  async componentWillMount() {
    if (Platform.OS == 'ios') {
      return;
    }
    await requestLocationPermission();
  } /*
_fbAuth() {
	LoginManager.logOut();
   LoginManager.logInWithPermissions(['public_profile', 'email', 'user_mobile_phone'])
    .then(result => {
        if (result.isCancelled) {
			        alert('Login cancelled');

            console.log('Login cancelled');
        } else {
						       
            console.log('Login success with permissions: ' + result.grantedPermissions.toString());
            AccessToken.getCurrentAccessToken().then((data) => {
          let accessToken = data.accessToken
       
          const responseInfoCallback = (error, result) => {
            if (error) {
              console.log(error)
              alert('Error fetching data: ' + error.toString());
            } else {
              console.log(result.name);
             // this.props.uname1 = result.name;
                           this._onPressSignUp;

                            console.log('Sugan Navigated');

             // alert('Success fetching data: ' + result.toString());
            }
          }

          const infoRequest = new GraphRequest('/me', {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: 'email,name,first_name,middle_name,last_name'
              }
            }
          }, responseInfoCallback);

          // Start the graph request.
          new GraphRequestManager()
            .addRequest(infoRequest)
            .start()

        })
        
        }
    // .catch chained from .then to handle all rejections
    }).catch(error => {
        console.log('Login fail with error: ' + error);
        alert('Error at login, no network ?');
    })
  }
 */
  render() {
    return (
      <View style={{flex: 5}}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Image
          source={Assets.bgHome}
          style={{
            flex: 3,
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
          }}>
          <View style={{flex: 7}} />
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EDThemeButton
              onPress={() => {
                this._onPressSignIn();
              }}
              label={strings('splash.signin')}
            />
            <EDSkipButton
              onPress={() => {
                this._onPressSkip();
              }}
              label={strings('splash.skip')}
            />

            <TouchableOpacity
              onPress={() => {
                this._onPressSignUp();
              }}>
              <Text style={{color: 'grey', fontSize: 16, marginTop: 10}}>
                {strings('splash.signup')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _onPressSignIn = () => {
    this.props.navigation.navigate('LoginContainer');
  };
  _onPressSkip() {
    // this.props.navigation.navigate("MainContainer");

    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        routeName: 'MainContainer',
        actions: [NavigationActions.navigate({routeName: 'MainContainer'})],
      }),
    );
  }
  _onPressSignUp() {
    this.props.navigation.navigate('SignupContainer');
  }
}

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: this.title,
        message: this.message,
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}

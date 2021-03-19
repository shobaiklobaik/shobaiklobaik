import React from "react";
import {
  View,
  Image,
  Platform,
  AppState,
  Linking,
} from "react-native";
import Assets from "../assets";
import { PermissionsAndroid } from "react-native";
import { getUserToken } from "../utils/AsyncStorageHelper";
import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { saveUserDetailsInRedux } from "../redux/actions/User";
import {
  ORDER_TYPE,
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  isRTLCheck
} from "../utils/Constants";
import NavigationService from "../../NavigationService";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { isLocationEnable } from "../utils/LocationCheck";

var redirectType = "";

class InitialContainer extends React.Component {
  constructor(props) {
    super(props);

    this.userObj = undefined;
    redirectType = this.props.screenProps;
    this.isOpenSetting = false
  }

  state = {
    isRefresh: false,
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (Platform.OS == "android") {
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }
  }

  _handleAppStateChange = (nextAppState) => {
    console.log("app state", nextAppState)
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')

      if (this.isOpenSetting == true) {
        console.log("get back result successs")
        this.checkLocationIOS()
      }
    }
    this.setState({ appState: nextAppState });
  }

  componentWillReceiveProps(prop) { }

  
  async componentWillMount() {
  
    if (Platform.OS == "android") {
      isLocationEnable(
        success => {
          console.log("success from initial container");
          requestLocationPermission(this.props);
        },
        error => {
          console.log("error");
          showValidationAlert("Please allow location access from setting");
        },
        backPress => {
          console.log(backPress);
        }
      );
    } else {
      this.checkLocationIOS()
    }
  }

  checkLocationIOS() {
    
    navigator.geolocation.getCurrentPosition(() => {
      
      requestLocationPermission(this.props);
    },
      () => {
        console.log("ios DENIED")
        showDialogue("Please allow location access from setting", [{
          "text": "OK", onPress: () => {
            this.isOpenSetting = true
            Linking.openURL("app-settings:");
          }
        }])

      },
    )
  }


  render() {
    this.props.navigation.addListener("didFocus", payload => {
      if (redirectType == undefined) {
        redirectType = DEFAULT_TYPE;
        _checkData(this.props);
        // this.setState({ isRefresh: this.state.isRefresh ? false : true });
      }
    });

    return (
      <View style={{ flex: 1 }}>
        <Image
          source={Assets.bgHome}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        />
      </View>
    );
  }
}

export async function requestLocationPermission(prop) {
  if (Platform.OS == "ios") {
    _checkData(prop);
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "SHOBAIK LOBAIK Delivery",
        message: "Allow SHOBAIK LOBAIK Delivery to access your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      _checkData(prop);
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}

export function _checkData(props) {
  setTimeout(() => {
    getUserToken(
      success => {
        
          props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: isRTLCheck() ? "HomeRight" : "Home" })
              ]
            })
          );
      },
      failure => {
        props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            routeName: "LoginContainer",
          actions: [NavigationActions.navigate({ routeName: "LoginContainer" })]
          })
        );
      }
    );

    if (
      this.userObj != undefined &&
      this.userObj.PhoneNumber != "" &&
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
      }
    };
  }
)(InitialContainer);

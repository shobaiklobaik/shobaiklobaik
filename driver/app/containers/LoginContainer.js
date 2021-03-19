import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions, Platform
} from "react-native";
import Assets from "../assets";
import { Style } from "../stylesheet/StylesUtil";
import EDTextView from "../components/EDTextView";
import { EDColors } from "../assets/Colors";
import EditText from "../components/EditText";
import EDTextViewNormal from "../components/EDTextViewNormal";
import EDThemeButton from "../components/EDThemeButton";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { apiPost } from "../api/ServiceManager";
import {
  LOGIN_URL,
  RESPONSE_SUCCESS,
  FORGOT_PASSWORD,
  isRTLCheck,
  GOOGLE_API_KEY
} from "../utils/Constants";
import { isLocationEnable } from "../utils/LocationCheck";
import { Messages } from "../utils/Messages";
import ProgressLoader from "../components/ProgressLoader";
import { saveUserLogin, saveUserToken, saveUserFCM } from "../utils/AsyncStorageHelper";
import { connect } from "react-redux";
import { saveUserDetailsInRedux, saveUserFCMInRedux } from "../redux/actions/User";
import { StackActions, NavigationActions } from "react-navigation";
import { ETFonts } from "../assets/FontConstants";
import firebase from "react-native-firebase";
import ETextErrorMessage from "../components/ETextErrorMessage";
import { netStatus } from "../utils/NetworkStatusConnection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BaseContainer from "./BaseContainer";
import EDText from "../components/EDText";
import metrics from "../utils/metrics";
import { strings } from "../locales/i18n";
import Validations from "../utils/Validations";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextFieldTypes } from "../utils/Constants";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import I18n from 'react-native-i18n';

import Geocoder from "react-native-geocoding";
let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 23.8859;
const LONGITUDE = 45.0792;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.latitude = 0.0,
    this.longitude = 0.0,
    this.firebaseToken = ""
    try {
      this.isCheckout =
        this.props.navigation.state.params != undefined &&
          this.props.navigation.state.params.isCheckout != undefined
          ? this.props.navigation.state.params.isCheckout
          : false;
    } catch (error) {
      this.isCheckout = false;
    }

    this.validationsHelper = new Validations();
  }

  state = {
    phoneNumber: "",
    // forgotPwdPhoneNumber: "",
    password: "",
    isLoading: false,
    modelVisible: false,
    isForgotValidate: false,
    
    language:""
    // usernameError: "",
    // passwordError: "",
    // forgotPwdMsg: ""
  };

  async componentDidMount() {

    this.checkPermission();

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      // stationaryRadius: 50,
      distanceFilter: 5,
      // notificationTitle: 'Background tracking',
      // notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      notificationsEnabled: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 5000,
      fastestInterval: 2000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
  },
  success =>{
      console.log("Configure Success ::::::: ", success)
  },
  fail => {
      console.log("Configure fail :::::::")
  }
  );

  // BackgroundGeolocation.on('motionchange', (motionchange) => {
  //     console.log("MOTION CHANGE ::::::::: ", motionchange);
  // })
  BackgroundGeolocation.getCurrentLocation(location => {
      console.log("CURRENT LOCATION ::::::::: ", location)
      this.latitude = location.latitude,
      this.longitude = location.longitude
  });

    
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }

  }

  //3
  async getToken() {
    fcmToken = await firebase.messaging().getToken();
    this.firebaseToken = fcmToken
    // this.setState({ firebaseToken: fcmToken });
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) { }
  }

  numberDidChange = setNumber => {
    this.setState({
      shouldPerformValidation: false,
      phoneNumber: setNumber
    });
  };

  passwordDidChange = setPassword => {
    this.setState({
      shouldPerformValidation: false,
      password: setPassword
    });
  };

  onSignInClick = () => {

    this.setState({
      shouldPerformValidation: true
    })

    if (this.state.phoneNumber.trim() === "" && this.state.password.trim() === "") {
      return false;
    }
    
    if (
      this.validationsHelper
        .validateMobile(
          this.state.phoneNumber,
          strings("validationMsg.emailValidate")
        )
        .trim() == "" && this.state.password.trim() !== ""
    ) {
      this.callLoginAPI()
    } else {
      return;
    }
  }

  checkLocationIOS() {
    
    navigator.geolocation.getCurrentPosition(
      position => {
        this.latitude = position.coords.latitude,
              this.longitude = position.coords.longitude,
        

        // this.setState({ isLoading: false });
        // this.getAddress(position.coords.latitude, position.coords.longitude);
        console.log('CURRENT ADDRESSS :::::: ', position.coords.latitude, " :::::::::: ", position.coords.longitude)
      },
      error => {
        // this.setState({ isLoading: false });
        this.setState({ error: error.message });
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }

  callLoginAPI() {
    let lan = I18n.currentLocale();
    let langu ="";
    if(lan=="ar")
    {
       langu = "arabic";
        console.log("Sugan","language langu "+langu);
        this.setState({language:langu});
    }
    else
    {
      langu = "english";
      console.log("Sugan","language langu "+langu);
      this.setState({language:langu});
    }
    console.log("Sugan","language paramsss"+lan);

    let param = {
      language : langu,
      PhoneNumber: this.state.phoneNumber,
      Password: this.state.password,
      firebase_token: this.firebaseToken,
      latitude: this.latitude,
      longitude: this.longitude,
      phone_code: this.props.code
    }

    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          LOGIN_URL,
          param,
          response => {
            console.log("Sugan","Login Response ---- "+response);
            this.props.saveUserDetail(response.login);
            // this.props.saveToken(this.firebaseToken)
            BackgroundGeolocation.removeAllListeners();
            if(response.status == 0){
              showDialogue(response.message)
            }else{
              this.props.saveToken(this.firebaseToken)
              saveUserLogin(response.login)
                saveUserFCM(
                  this.firebaseToken, success => {}, failure => {}
                )
                
              // saveUserToken(this.firebaseToken, success => {}, errAsyncStore => { });
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: isRTLCheck() ? "HomeRight" : "Home" })
                  ]
                })
              );
            }
            
            this.setState({ isLoading: false });
          },
          error => {
            console.log("ERROR IN FAIL :::::::::: ", error)
            this.setState({ isLoading: false });
            // alert(error)
            showValidationAlert(error.data.message);
          }
        );
      } else {
        showValidationAlert(strings("general.noInternet"));
      }
    });
  }

  render() {
    return (
      <View style = {{flex:1}}>
        {this.state.isLoading ? <ProgressLoader /> : null}
      <ScrollView style={{flex:1, backgroundColor: EDColors.background }}>
        
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          behavior="padding"
          enabled
          contentContainerStyle={{ flex: 1 }}
        >
          
          < View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: EDColors.background }}
          >
            <Image
              style={{ width: '100%', height: metrics.screenHeight * 0.42 }}
              source={Assets.bg_login}
              // position="relative"
              resizeMode="cover"
            />

            
            {
              this.state.modelVisible ? null :
                <View
                  style={{
                    flex: 1,
                    marginTop: -70,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    marginBottom: 10,
                    width: '100%',
                  }}
                >

                  <View
                    style={{
                      backgroundColor: 'white',
                      // marginLeft: 10,
                      // marginRight: 10,
                      width: metrics.screenWidth * 0.93,
                      borderRadius: 10,
                      alignItems: "center"
                    }}
                  >
                    <Image style={{ alignSelf: "center", width: wp("40.0%"), height: wp("40.0%"), marginTop: 20 }} source={Assets.logo} position="relative"
                      resizeMode="contain" />
                    <EDText
                      style={{
                        flex: 1,
                        color: "black",
                        fontFamily: ETFonts.satisfy,
                        fontSize: wp("8.0%"),
                        textAlign: "center",
                        letterSpacing: 1.0
                      }}
                      label={strings("login.title")}
                    />

                    {/* </Text> */}

                    <View
                      style={{
                        // marginLeft: 20,
                        // marginRight: 20,
                        marginTop: metrics.screenHeight * 0.042,
                        width: metrics.screenWidth * 0.85,
                        // borderWidth:1
                      }}
                    >
                      <EDText style={{ flex: 1, color: EDColors.primary }} label={strings("login.phone")} />
                      <EditText

                        keyboardType="phone-pad"
                        maxLength={15}
                      //   isCode={true}
                      // codeLabel={this.props.code}
                        value={this.state.phoneNumber}
                        onChangeText={this.numberDidChange}
                        error={
                          this.state.shouldPerformValidation
                            ? this.validationsHelper.validateMobile(
                              this.state.phoneNumber,
                              strings("validationMsg.emptyNumber")
                            )
                            : ""
                        }
                      />

                      {/* <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.usernameError}
                    /> */}

                      <EDText style={{ flex: 1, color: EDColors.primary, marginTop: metrics.screenHeight * 0.02 }} label={strings("login.password")} />

                      <EditText
                        keyboardType="default"
                        secureTextEntry={true}
                        maxLength={15}
                        value={this.state.password}
                        onChangeText={this.passwordDidChange}
                        type={TextFieldTypes.password}
                        error={
                          this.state.shouldPerformValidation && this.state.password.trim() === ""
                            ? strings("validationMsg.emptyPassword")
                            : ""
                        }
                      />


                      <View style={{ alignSelf: isRTLCheck() ? "flex-start" : "flex-end" }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("ForgotPasswordContainer");
                          }}
                        >
                          {/* <EDText style={{ flex: 1, color: EDColors.primary }} label="Forgot Password?" /> */}
                          <EDTextViewNormal
                            //  style = {{fontFamily: ETFonts.hairline, color:EDColors.darkText}} 
                            text={strings("login.forgotPassword")} />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 20,
                          marginBottom: 20
                        }}
                      >
                        <EDThemeButton
                          label={strings("login.signin")}
                          isRadius={true}
                          style={{ width: metrics.screenWidth * 0.6, height: metrics.screenHeight * 0.076 }}
                          onPress={this.onSignInClick}
                        />

                      </View>
                    </View>
                  </View>
                </View>
            }
          </View>
        </KeyboardAwareScrollView>
        
      </ScrollView>
      </View>

    );
  }
}

export default connect(
  state => {
    return {
      code: state.userOperations.code,
    };
  },
  dispatch => {
    return {
      saveUserDetail: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveToken: token => {
        dispatch(saveUserFCMInRedux(token))
      }
    };
  }
)(LoginContainer);

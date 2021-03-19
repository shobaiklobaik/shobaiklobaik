import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from 'react-native';
import Assets from '../assets';
import {Style} from '../stylesheet/StylesUtil';
import EDTextView from '../components/EDTextView';
import {EDColors} from '../assets/Colors';
import EditText from '../components/EditText';
import EDTextViewNormal from '../components/EDTextViewNormal';
import EDThemeButton from '../components/EDThemeButton';
import {showValidationAlert} from '../utils/CMAlert';
import {apiPost} from '../api/APIManager';
import {LOGIN_URL, RESPONSE_SUCCESS, FORGOT_PASSWORD} from '../utils/Constants';
//import { Messages } from "../utils/Messages";
import ProgressLoader from '../components/ProgressLoader';
import {saveUserLogin, saveUserFCM} from '../utils/AsyncStorageHelper';
import {connect} from 'react-redux';
import {
  saveUserDetailsInRedux,
  saveUserFCMInRedux,
} from '../redux/actions/User';
import {StackActions, NavigationActions} from 'react-navigation';
import {ETFonts} from '../assets/FontConstants';
import firebase from 'react-native-firebase';
import ETextErrorMessage from '../components/ETextErrorMessage';
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MvalidationPhoneMsg = strings('Messages.validationPhoneMsg');
    this.MphoneValidationString = strings('Messages.phoneValidationString');
    this.MvalidationPasswordMsg = strings('Messages.validationPasswordMsg');
    this.MforgotPasswordTxt = strings('Messages.forgotPasswordTxt');
    this.MforgotPasswordValidMobileMsg = strings(
      'Messages.forgotPasswordValidMobileMsg',
    );
    this.Mlogin = strings('Messages.login');
    this.CheckLanguage();
    try {
      this.isCheckout =
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.isCheckout != undefined
          ? this.props.navigation.state.params.isCheckout
          : false;
    } catch (error) {
      this.isCheckout = false;
    }
  }

  state = {
    language: '',
    phoneNumber: '',
    forgotPwdPhoneNumber: '',
    password: '',
    isLoading: false,
    modelVisible: false,
    isForgotValidate: false,
    firebaseToken: '',
    usernameError: '',
    passwordError: '',
    forgotPwdMsg: '',
  };

  async componentDidMount() {
    this.checkPermission();
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
    this.setState({firebaseToken: fcmToken});
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) {}
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
  onSignInClick() {
    if (this.validation()) {
      this.userLogin();
    }
  }

  onForgotPwdClick() {
    if (this.validationPhone()) {
      this.forgotPasswordApi();
    }
  }

  validationPhone() {
    if (this.state.forgotPwdPhoneNumber.trim() === '') {
      showValidationAlert(this.MvalidationPhoneMsg);
      return false;
    } else if (this.state.forgotPwdPhoneNumber.trim().length < 9) {
      showValidationAlert(this.MphoneValidationString);
      return false;
    } else {
      return true;
    }
  }

  validation() {
    if (this.state.phoneNumber.trim() === '') {
      this.setState({
        usernameError: this.MvalidationPhoneMsg,
        passwordError: '',
      });
      return false;
    } else if (this.state.phoneNumber.trim().length < 9) {
      this.setState({
        usernameError: this.MphoneValidationString,
        passwordError: '',
      });
      return false;
    } else if (this.state.password.trim() === '') {
      this.setState({
        usernameError: '',
        passwordError: this.MvalidationPasswordMsg,
      });
      return false;
    } else {
      this.setState({usernameError: '', passwordError: ''});
      return true;
    }
  }

  userLogin() {
    netStatus(status => {
      if (status) {
        console.log('Firebase Token :::::::::: ', this.state.firebaseToken);
        console.log('Sugan', 'lang ===========', this.state.language);
        this.setState({isLoading: true});
        apiPost(
          LOGIN_URL,
          {
            language: this.state.language,
            PhoneNumber: this.state.phoneNumber,
            Password: this.state.password,
            firebase_token: this.state.firebaseToken,
            phone_code: this.props.code,
          },
          response => {
            this.setState({isLoading: false});
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.props.saveCredentials(response.login);
              saveUserLogin(response.login, success => {}, errAsyncStore => {});
              if (this.isCheckout) {
                this.props.navigation.goBack();
              } else {
                this.props.saveToken(this.state.firebaseToken);
                saveUserFCM(
                  this.state.firebaseToken,
                  success => {},
                  failure => {},
                );
                this.props.navigation.dispatch(
                  StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({routeName: 'MainContainer'}),
                    ],
                  }),
                );
              }
            } else if (response.active == false) {
              this.props.navigation.navigate('OTPContainer', {
                phNo: this.state.phoneNumber,
                password: this.state.password,
              });
            } else {
              showValidationAlert(response.message);
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

  forgotPasswordApi() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          FORGOT_PASSWORD,
          {
            language: this.state.language,
            PhoneNumber: this.state.forgotPwdPhoneNumber,
            phone_code: this.props.code,
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.setState({
                  isLoading: false,
                  isForgotValidate: true,
                  forgotPwdMsg: resp.password,
                  forgotPwdPhoneNumber: '',
                });
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

  render() {
    return (
      <ImageBackground
        source={Assets.bg_login}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          contentContainerStyle={{flex: 1}}
          style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.isLoading ? <ProgressLoader /> : null}

            <Modal
              visible={this.state.modelVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                this.setState({
                  modelVisible: false,
                  isForgotValidate: false,
                  forgotPwdPhoneNumber: '',
                });
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.50)',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    borderRadius: 4,
                    marginTop: 20,
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: EDColors.primary,
                        fontSize: 24,
                        fontFamily: ETFonts.satisfy,
                        marginLeft: 10,
                        alignSelf: 'center',
                        flex: 1,
                      }}>
                      {this.MforgotPasswordTxt}
                    </Text>
                    <TouchableOpacity
                      style={{padding: 5}}
                      onPress={() => {
                        this.setState({
                          modelVisible: false,
                          isForgotValidate: false,
                          forgotPwdPhoneNumber: '',
                        });
                      }}>
                      <Image
                        style={{
                          alignContent: 'flex-end',
                          height: 15,
                          width: 15,
                        }}
                        source={Assets.ic_close}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.isForgotValidate ? (
                    <View>
                      <Text
                        selectable={true}
                        style={{
                          color: EDColors.black,
                          fontSize: 16,
                          padding: 10,
                          fontFamily: ETFonts.regular,
                          marginLeft: 10,
                        }}>
                        {this.MforgotPasswordValidMobileMsg}
                      </Text>
                    </View>
                  ) : (
                    <View style={{marginLeft: 10, marginRight: 10}}>
                      <EDTextView text={strings('login.phone')} />
                      <EditText
                        keyboardType="phone-pad"
                        secureTextEntry={false}
                        // isCode={true}
                        // codeLabel={this.props.code}
                        maxLength={15}
                        value={this.state.forgotPwdPhoneNumber}
                        placeholder={strings('login.phone')}
                        onChangeText={text => {
                          var newText = text.replace(/[^0-9]/g, '');
                          this.setState({forgotPwdPhoneNumber: newText});
                        }}
                      />

                      <EDThemeButton
                        style={{margin: 10, alignSelf: 'center'}}
                        label={strings('login.ok')}
                        buttonWidth={100}
                        onPress={() => {
                          this.onForgotPwdClick();
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
              {/* </TouchableOpacity> */}
            </Modal>

            {this.state.modelVisible ? null : (
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}>
                <View
                  style={{
                    flex: 3,
                    justifyContent: 'flex-end',
                  }}>
                  <Image style={{alignSelf: 'center'}} source={Assets.logo} />
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: ETFonts.satisfy,
                      fontSize: 45,
                      marginTop: 10,
                      alignSelf: 'center',
                    }}>
                    {this.Mlogin}
                  </Text>
                </View>

                <View style={{flex: 4}}>
                  <View style={Style.loginView}>
                    <EDTextView text={strings('login.phone')} />
                    <EditText
                      keyboardType="phone-pad"
                      secureTextEntry={false}
                      // isCode={true}
                      // codeLabel={this.props.code}
                      maxLength={15}
                      value={this.state.phoneNumber}
                      onChangeText={text => {
                        var newText = text.replace(/[^0-9]/g, '');
                        this.setState({phoneNumber: newText});
                      }}
                    />

                    <ETextErrorMessage
                      errorStyle={{marginTop: 3}}
                      errorMsg={this.state.usernameError}
                    />

                    <EDTextView text={strings('login.password')} />
                    <EditText
                      keyboardType="default"
                      secureTextEntry={true}
                      maxLength={15}
                      onChangeText={text => {
                        this.state.password = text;
                      }}
                    />
                    <ETextErrorMessage
                      errorStyle={{marginTop: 3}}
                      errorMsg={this.state.passwordError}
                    />

                    <View style={{alignSelf: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({modelVisible: true});
                          //this.props.navigation.navigate("ForgotPassword");
                        }}>
                        <EDTextViewNormal text={strings('login.f_password')} />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        // borderWidth:1,
                        // borderColor: EDColors.white
                      }}>
                      <EDThemeButton
                        // label="SIGN IN"
                        label={strings('login.login')}
                        style={{alignSelf: 'center'}}
                        onPress={() => {
                          this.onSignInClick();
                        }}
                      />
                      <View
                        style={{
                          alignSelf: 'center',
                          marginTop: 5,
                        }}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() => {
                            this.props.navigation.navigate('SignupContainer');
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 16,
                              marginTop: 10,
                              fontFamily: ETFonts.regular,
                            }}>
                            {strings('login.account')}
                          </Text>
                          <EDTextViewNormal text={strings('login.signup')} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

export default connect(
  state => {
    console.log('State Value :::::: ', state);
    return {
      code: state.userOperations.code,
    };
  },
  dispatch => {
    return {
      saveCredentials: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveToken: token => {
        dispatch(saveUserFCMInRedux(token));
      },
    };
  },
)(LoginContainer);

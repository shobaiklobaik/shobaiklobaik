import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import ProgressLoader from '../components/ProgressLoader';
import {RESPONSE_SUCCESS, VERIFY_OTP, APP_NAME} from '../utils/Constants';
import EDThemeButton from '../components/EDThemeButton';
import firebase from 'react-native-firebase';
import BaseContainer from './BaseContainer';
import {apiPost} from '../api/APIManager';
import {
  showValidationAlert,
  showDialogue,
  showDialogueNew,
} from '../utils/CMAlert';
import Assets from '../assets';
//import { Messages } from "../utils/Messages";
import {StackActions, NavigationActions} from 'react-navigation';
import {saveUserLogin} from '../utils/AsyncStorageHelper';
import {ETFonts} from '../assets/FontConstants';
import {connect} from 'react-redux';
import {saveUserDetailsInRedux} from '../redux/actions/User';
import {netStatus} from '../utils/NetworkStatusConnection';
import {EDColors} from '../assets/Colors';
import Toast, {DURATION} from 'react-native-easy-toast';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';

const successImageUri =
  'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

class OTPContainer extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.verificationId = 0;
    this.OTP = strings('OTPContainer.OTP');
    this.sent = strings('OTPContainer.sent');
    this.Enter = strings('OTPContainer.Enter');
    this.we = strings('OTPContainer.we');
    this.OTP1 = strings('OTPContainer.OTP1');
    this.enterOTP = strings('OTPContainer.enterOTP');
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.CheckLanguage();
  }

  state = {
    language: '',
    isLoading: false,
    user: null,
    message: '',
    codeInput: '',
    phoneNumber: this.props.navigation.state.params.phNo,
    password: this.props.navigation.state.params.password,
    confirmResult: null,
    isResendShow: false,
  };

  componentDidMount() {
    this.doFirebase();
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  doFirebase() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          confirmResult: null,
        });
        console.log('doFirebase is User');
        this.signIn();
      } else {
        // User has been signed out, reset the state

        this.setState({
          user: null,
          message: '',
          codeInput: '',
          confirmResult: null,
        });
        console.log('doFirebase is not User');
        this.signIn();
      }
    });
  }

  signIn = () => {
    console.log('sign in calledss' + this.props.navigation.state.params.phNo);
    this.newPhone = '+962' + this.props.navigation.state.params.phNo;
    console.log('sign in newPhone' + this.newPhone);

    firebase
      .auth()
      .verifyPhoneNumber(this.newPhone)
      .on('state_changed', phoneAuthSnapshot => {
        switch (phoneAuthSnapshot.state) {
          case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('code send success');
            this.verificationId = phoneAuthSnapshot.verificationId;
            // this.refs.toast.show(
            //   "OTP request sent successfully!",
            //   DURATION.LENGTH_SHORT
            // );
            this.setState({isResendShow: true});

            break;
          case firebase.auth.PhoneAuthState.ERROR: // or 'error'
            break;
          case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            break;
          case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            this.setState({codeInput: phoneAuthSnapshot.code}, () => {
              const credential = firebase.auth.PhoneAuthProvider.credential(
                phoneAuthSnapshot.verificationId,
                phoneAuthSnapshot.code,
              );

              firebase
                .auth()
                .signInWithCredential(credential)
                .then(confirmResult => {
                  this.sendtoNextScreen();
                })
                .catch(error => {
                  console.log('Error 1 called', error);
                  showValidationAlert(this.OTP);
                });
            });
            break;
        }
      })
      .then(confirmResult => {
        this.setState({confirmResult, message: this.sent});
      })
      .catch(error => {
        console.log('error', error.message);
        showDialogueNew(error.message, [], APP_NAME, okButtonHandler => {
          this.props.navigation.goBack();
        });

        this.setState({
          message: `Phone Number Error: ${error.message}`,
        });
      });
  };

  confirmCode() {
    const {codeInput, confirmResult} = this.state;
    if (
      this.verificationId != undefined &&
      this.verificationId != undefined &&
      this.verificationId != ''
    ) {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        codeInput,
      );

      firebase
        .auth()
        .signInWithCredential(credential)
        .then(confirmResult => {
          this.sendtoNextScreen();
        })
        .catch(error => {
          this.setState({isLoading: false});
          console.log('Error 2 called', error);
          showValidationAlert(this.OTP);
        });
    } else {
      this.setState({isLoading: false});
      console.log('Error 3 called');
      showValidationAlert(this.OTP);
    }
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
  sendtoNextScreen() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          VERIFY_OTP,
          {
            language: this.state.language,
            PhoneNumber: this.state.phoneNumber,
            Password: this.state.password,
            active: '1',
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
              saveUserLogin(response.login, success => {}, errAsyncStore => {});
              this.props.saveCredentials(response.login);
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({routeName: 'MainContainer'}),
                  ],
                }),
              );
            } else {
              showValidationAlert(response.message);
            }
          },
          error => {
            console.log('Error Normal Api Error');
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
    const {user, confirmResult} = this.state;
    return (
      <BaseContainer
        title={strings('OTPContainer.Verification')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        <Toast
          style={{backgroundColor: 'white'}}
          textStyle={{color: 'red'}}
          ref="toast"
          position="center"
          fadeInDuration={0}
        />
        {this.state.isLoading ? <ProgressLoader /> : null}
        <ImageBackground
          source={Assets.bg_login}
          style={{width: '100%', height: '100%'}}>
          {/* <ScrollView
            style={{
              flex: 1
            }}
          > */}
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            contentContainerStyle={{flex: 1}}
            style={{flex: 1}}>
            <View style={{flex: 1}}>
              {/* <View style={{ flex: 1 }} /> */}

              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: EDColors.white,
                    marginTop: 15,
                    marginLeft: 10,
                    marginRight: 10,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    fontFamily: ETFonts.satisfy,
                    fontSize: 50,
                  }}>
                  Shobaik Lobaik User
                </Text>
                <Text
                  style={{
                    color: EDColors.primary,
                    marginTop: 15,
                    marginLeft: 10,
                    marginRight: 10,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    fontFamily: ETFonts.bold,
                    fontSize: 18,
                  }}>
                  {this.Enter + this.state.phoneNumber + this.we}
                </Text>

                <View
                  style={{
                    //flex: 1,
                    marginTop: 30,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1}} />
                  <TextInput
                    keyboardType="numeric"
                    maxLength={6}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    style={{
                      flex: 1,
                      color: '#000',
                      fontFamily: ETFonts.regular,
                      fontSize: 15,
                      justifyContent: 'center',
                      textAlign: 'center',
                      textAlignVertical: 'top',
                      padding: 10,
                      borderRadius: 6,
                      borderColor: '#383736',
                      borderWidth: 1,
                      backgroundColor: '#fff',
                    }}
                    placeholderTextColor="#C7C7CD"
                    value={this.state.codeInput}
                    onChangeText={text => {
                      this.setState({codeInput: text});
                    }}
                    placeholder={strings('OTPContainer.OTP1')}
                  />
                  <View style={{flex: 1}} />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <EDThemeButton
                    isDisable={this.state.isLoading ? true : false}
                    label={strings('OTPContainer.Verify')}
                    buttonWidth={100}
                    style={{margin: 10}}
                    onPress={() => {
                      if (
                        this.state.codeInput === '' ||
                        this.state.codeInput === undefined
                      ) {
                        showValidationAlert(this.enterOTP);
                      } else {
                        this.confirmCode();
                        this.setState({isLoading: true});
                      }
                    }}
                  />

                  {this.state.isResendShow ? (
                    <EDThemeButton
                      label={strings('OTPContainer.ResendOTP')}
                      borderButton={this.state.isPositive}
                      buttonWidth={120}
                      style={{margin: 10}}
                      onPress={() => {
                        console.log('resend button pressed');
                        this.signIn();
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </View>
            {/* </ScrollView> */}
          </KeyboardAvoidingView>
        </ImageBackground>
      </BaseContainer>
    );
  }
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
    };
  },
)(OTPContainer);

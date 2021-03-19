import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView
} from "react-native";
import Assets from "../assets";
import { Style } from "../stylesheet/StylesUtil";
import EDTextView from "../components/EDTextView";
import { EDColors } from "../assets/Colors";
import EditText from "../components/EditText";
import BaseContainer from "./BaseContainer";
import EDThemeButton from "../components/EDThemeButton";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { apiPost } from "../api/APIManager";
import {
  LOGIN_URL,
  RESPONSE_SUCCESS,
  FORGOT_PASSWORD,
  isRTLCheck
} from "../utils/Constants";
import { Messages } from "../utils/Messages";
import ProgressLoader from "../components/ProgressLoader";
import { saveUserLogin } from "../utils/AsyncStorageHelper";
import { connect } from "react-redux";
import { saveUserDetailsInRedux } from "../redux/actions/User";
import { StackActions, NavigationActions } from "react-navigation";
import { ETFonts } from "../assets/FontConstants";
import firebase from "react-native-firebase";
import ETextErrorMessage from "../components/ETextErrorMessage";
import { netStatus } from "../utils/NetworkStatusConnection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import metrics from "../utils/metrics";
import { strings } from "../locales/i18n";
import EDText from "../components/EDText";
import Validations from "../utils/Validations";
import { TextFieldTypes } from "../utils/TextFieldTypes";
import I18n from "react-native-i18n";

class ForgotPasswordContainer extends React.Component {
  constructor(props) {
    super(props);

    this.validationsHelper = new Validations();
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
    phoneNumber: "",
    forgotPwdPhoneNumber: "",
    password: "",
    isLoading: false,
    shouldPerformValidation: false,
    modelVisible: false,
    isForgotValidate: false,
    firebaseToken: "",
    usernameError: "",
    passwordError: "",
    forgotPwdMsg: "",
    strForgotPwd: "",
    language: ""
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
    this.setState({ firebaseToken: fcmToken });
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) {}
  }

  numberDidChange = setNumber => {
    this.setState({
      shouldPerformValidation: false,
      phoneNumber: setNumber
    });
  };

  validationPassword = () => {
    this.setState({
      shouldPerformValidation: true
    });
    if (this.state.phoneNumber.trim() === "") {
      return false;
    }
    if (
      this.validationsHelper
        .validateMobile(
          this.state.phoneNumber,
          strings("validationMsg.emptyNumber")
        )
        .trim() == ""
    ) {
      // return true;
      // showDialogue(strings("login.forgotConfirm") + this.state.forgotPwdPhoneNumber )
      this.forgotPasswordAPI();
    } else {
      return;
    }
  };

  forgotPasswordAPI() {
    let lan = I18n.currentLocale();
    let langu = "";
    if (lan == "ar") {
      langu = "arabic";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    } else {
      langu = "english";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    }
    console.log("Sugan", "language paramsss" + lan);

    let param = {
      language: langu,
      mobile_number: this.state.phoneNumber,
      phone_code: this.props.code
    };
    netStatus(status => {
      if (status == true) {
        this.setState({ isLoading: true });
        apiPost(
          FORGOT_PASSWORD,
          param,
          resp => {
            // showValidationAlert(resp.password);
            // showDialogue(strings("login.forgotConfirm") + resp.password,[], "", ()=>{
            //   this.navigateToPreviousScreen()
            // } )

            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.state.strForgotPwd = resp.password;
                this.setState({
                  isLoading: false,
                  // strForgotPwd: resp.password,
                  modelVisible: true
                });
              } else {
                showValidationAlert(resp.message);
                this.setState({ isLoading: false });
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({ isLoading: false });
            }
          },
          err => {
            this.setState({ isLoading: false });
            showDialogue(err.message, [], "");
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  navigateToPreviousScreen = () => {
    this.props.navigation.goBack();
  };

  displayModal = () => {
    return (
      <Modal
        visible={this.state.modelVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({
            modelVisible: false,
            isForgotValidate: false,
            forgotPwdPhoneNumber: ""
          });
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.50)"
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 4,
              marginTop: 20,
              justifyContent: "center",
              marginBottom: 20
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: EDColors.primary,
                  fontSize: 24,
                  fontFamily: ETFonts.satisfy,
                  marginLeft: 10,
                  alignSelf: "center",
                  flex: 1
                }}
              >
                {strings("signUp.forgotPassword")}
              </Text>
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  this.setState(
                    {
                      modelVisible: false,
                      isForgotValidate: false,
                      forgotPwdPhoneNumber: ""
                    },
                    this.navigateToPreviousScreen()
                  );
                }}
              >
                <Image
                  style={{
                    alignContent: "flex-end",
                    height: 15,
                    width: 15
                  }}
                  source={Assets.ic_close}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                selectable={true}
                style={{
                  color: EDColors.black,
                  fontSize: 16,
                  padding: 10,
                  fontFamily: ETFonts.regular,
                  marginLeft: 10
                }}
              >
                {strings("signUp.forgotPasswordValidMobileMsg")
                // + " - " +
                //   this.state.strForgotPwd
                }
              </Text>
            </View>
          </View>
        </View>
        {/* </TouchableOpacity> */}
      </Modal>
    );
  };
  render() {
    return (
      <BaseContainer
        title={strings("signUp.forgotPassword")}
        left={Assets.backWhite}
        right={[]}
        onLeft={this.navigateToPreviousScreen}
        isLoading={this.state.isLoading}
      >
        <ScrollView style={{ backgroundColor: "white" }}>
          <KeyboardAwareScrollView
            behavior="padding"
            enabled
            contentContainerStyle={{ flex: 1 }}
            style={{ flex: 1, backgroundColor: "white" }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  marginBottom: 10,
                  width: "100%",
                  // justifyContent: "center",
                  alignItems: "center"
                  // borderWidth: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    width: metrics.screenWidth,
                    height: metrics.screenWidth * 0.786,
                    alignItems: "center",
                    justifyContent: "center"
                    // borderWidth: 1,
                    // borderColor: 'green'
                  }}
                >
                  <Image
                    style={{
                      alignSelf: "center",
                      width: metrics.screenWidth * 0.625,
                      height: metrics.screenWidth * 0.625
                    }}
                    source={Assets.forgotLogo}
                    position="relative"
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    width: metrics.screenWidth * 0.85,
                    marginTop: metrics.screenWidth * 0.08
                    // borderWidth: 1,
                    // borderColor: 'red'
                  }}
                >
                  {/* <EDTextView text={strings("login.phone")} /> */}
                  <EDText
                    style={{ flex: 1, color: EDColors.primary }}
                    label={strings("login.phone")}
                  />

                  <EditText
                    keyboardType="phone-pad"
                    secureTextEntry={false}
                    // isCode={true}
                    // codeLabel={this.props.code}
                    maxLength={15}
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

                  {/* <View style={{ alignSelf: "flex-end" }}>
                </View> */}
                  <View
                    style={{
                      alignSelf: "center",
                      // marginTop: 30,
                      marginBottom: 20,
                      width: metrics.screenWidth * 0.85,
                      height: metrics.screenWidth * 0.13
                    }}
                  >
                    <EDThemeButton
                      label={strings("login.resetPassword")}
                      isRadius={true}
                      style={{
                        marginTop: 30,
                        marginBottom: 20,
                        width: metrics.screenWidth * 0.85,
                        height: metrics.screenHeight * 0.076
                      }}
                      onPress={() => {
                        this.validationPassword();
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            {this.displayModal()}
          </KeyboardAwareScrollView>
        </ScrollView>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    return {
      code: state.userOperations.code
    };
  },
  dispatch => {
    return {
      saveCredentials: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      }
    };
  }
)(ForgotPasswordContainer);

import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
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
  TextFieldTypes,
  RESET_PASSWORD_REQ_URL
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
import { getUserToken } from "../utils/AsyncStorageHelper";
import EDText from "../components/EDText";
import metrics from "../utils/metrics";
import { strings } from "../locales/i18n";
import Validations from "../utils/Validations";
import I18n from 'react-native-i18n';

class ChangePasswordContainer extends React.Component {
  constructor(props) {
    super(props);

    this.validationsHelper = new Validations();

    this.state = {
      isLoading: false,
      shouldPerformValidation: false,
      oldPassword: "",
      newPassword: "",
      cnfPassword: "",
      language:""
    };
  }

  componentDidMount() {
    getUserToken(
      success => {
        userObj = success;
        this.setState({
          firstName: userObj.first_name,
          PhoneNumber: userObj.PhoneNumber
        });
      },
      failure => { }
    );
  }

  oldPasswordDidChange = setOldpassword => {
    this.setState({
      shouldPerformValidation: false,
      oldPassword: setOldpassword
    });
  };

  newPasswordDidChange = setnewPassword => {
    this.setState({
      shouldPerformValidation: false,
      newPassword: setnewPassword
    });
  };

  confirmPasswordDidChange = setconfirmPassword => {
    this.setState({
      shouldPerformValidation: false,
      cnfPassword: setconfirmPassword
    });
  };

  validationPassword = () => {

    this.setState({
      shouldPerformValidation: true
    })
    if (this.state.oldPassword.trim() === "" || this.state.newPassword.trim() === "" || this.state.cnfPassword.trim() === "") {
      return false;
    }
    if (this.validationsHelper
        .validatePassword(
          this.state.newPassword,
          strings("validationMsg.emptyPassword")
        )
        .trim() == "" && this.validationsHelper
          .ValidateConfirmPassword(
            this.state.cnfPassword,
            this.state.newPassword,
            strings("validationMsg.emptyconfirmPassword")
          )
          .trim() == "") {
            this.changePasswordAPI()
      // return true;
      // showDialogue("Password successfully change")
    }else{
      return;
    }
  }

  navigateToPreviousScreen = () => {
    this.props.navigation.goBack();
  }

  changePasswordAPI() {
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
      user_id: parseInt(userObj.UserID) || 0,
      token: "" + userObj.PhoneNumber,
      old_password: this.state.oldPassword,
      password: this.state.newPassword,
      confirm_password: this.state.cnfPassword
    }

    this.setState({isLoading: true})
    netStatus(status => {
      if (status) {
        apiPost(
          RESET_PASSWORD_REQ_URL,
          param,
          resp => {

            showDialogue(resp.message,[],"",()=>{
              if(resp.status == 1){
                this.navigateToPreviousScreen()
              }
            });
            this.setState({ 
              shouldPerformValidation:false,
              isLoading: false,
              oldPassword: '',
              newPassword: '',
              cnfPassword: ''
             });

            
          },
          err => {
            this.setState({ isLoading: false });
            console.log(err);
            showDialogue(err.message,[],"");
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  render() {
    return (
      <BaseContainer
        title={strings("login.changepassword")}
        left={Assets.backWhite}
        right={[]}
        onLeft={()=>{
          this.props.navigation.goBack();
        }}
        isLoading={this.state.isLoading}
      >
        <ScrollView style = {{backgroundColor: EDColors.background}}>
          <KeyboardAwareScrollView
            behavior="padding"
            enabled
            contentContainerStyle={{ flex: 1 }}
            style={{ flex: 1, backgroundColor: EDColors.background }}
          >

            <View
              style={{
                flex: 1,
                // backgroundColor: 'transparent',
                backgroundColor: EDColors.background,
                marginBottom: 10,
                width: '100%',
                alignItems: 'center'
              }}
            >

              {/* <View
                  style={{
                    backgroundColor: 'white',
                    borderWidth:1
                  }}
                > */}
              <Image style={{ alignSelf: "center", width: metrics.screenWidth * 0.625, height: metrics.screenWidth * 0.625, marginTop: 20, }} source={Assets.forgotLogo} position="relative"
                resizeMode="contain" />

              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: metrics.screenWidth * 0.08,
                  width: metrics.screenWidth * 0.85,
                  // borderWidth:1
                }}
              >
                <EDText style={{ flex: 1, color: EDColors.primary }} label={strings("login.oldpassword")} />
                <EditText
                  keyboardType="default"
                  secureTextEntry={true}
                  maxLength={30}
                  value={this.state.oldPassword}
                  type = {TextFieldTypes.password}
                  onChangeText={this.oldPasswordDidChange}
                  error={
                    this.state.shouldPerformValidation && this.state.oldPassword.trim() == ""
                            ? strings("validationMsg.emptyPassword")
                            : ""
                  }
                />

                <EDText style={{ flex: 1, color: EDColors.primary, marginTop: metrics.screenHeight * 0.02 }} label={strings("login.newpassword")} />

                <EditText
                  keyboardType="default"
                  secureTextEntry={true}
                  maxLength={30}
                  value={this.state.newPassword}
                  type = {TextFieldTypes.password}
                  onChangeText={this.newPasswordDidChange}
                  error={
                    this.state.shouldPerformValidation
                      ? this.validationsHelper.validatePassword(
                        this.state.newPassword,
                        strings("validationMsg.emptyPassword")
                      )
                      : ""
                  }
                />

                <EDText style={{ flex: 1, color: EDColors.primary, marginTop: metrics.screenHeight * 0.02 }} label={strings("login.confirmPassword")} />

                <EditText
                  keyboardType="default"
                  secureTextEntry={true}
                  maxLength={30}
                  value={this.state.cnfPassword}
                  type = {TextFieldTypes.password}
                  onChangeText={this.confirmPasswordDidChange}
                  error={
                    this.state.shouldPerformValidation
                      ? this.validationsHelper.ValidateConfirmPassword(
                        this.state.newPassword,
                        this.state.cnfPassword,
                        strings("validationMsg.emptyconfirmPassword")
                      )
                      : ""
                  }
                />

                <View
                  style={{
                    alignSelf: "center",
                    marginTop: metrics.screenHeight * 0.02,
                    marginBottom: metrics.screenHeight * 0.01,
                    width: metrics.screenWidth * 0.85,
                    height: metrics.screenWidth * 0.13,
                    // marginTop: 20,
                    // marginBottom: 20
                  }}
                >
                  <EDThemeButton
                    label={strings("login.resetPassword")}
                    isRadius={true}
                    style={{ width: metrics.screenWidth * 0.85, height: metrics.screenHeight * 0.076 }}
                    onPress={() => {
                      this.validationPassword();
                    }}
                  />
                </View>
              </View>
            </View>

            {/* </View> */}
            {/* </View> */}
          </KeyboardAwareScrollView>
        </ScrollView>
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
      saveCredentials: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      }
    };
  }
)(ChangePasswordContainer);

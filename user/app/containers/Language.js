import React from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';
import BaseContainer from './BaseContainer';
import {apiPost} from '../api/APIManager';
import {
  CMS_PAGE,
  RESPONSE_SUCCESS,
  PRIVACY_POLICY,
  LANGUAGE_SETTINGS,
} from '../utils/Constants';
import {showValidationAlert} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import {netStatus} from '../utils/NetworkStatusConnection';
import MyWebView from 'react-native-webview';
import {strings} from '../locales/i18n';
//import FlipToggle from "react-native-flip-toggle-button";
import SwitchToggle from 'react-native-switch-toggle';
import {
  saveLanguage,
  getLanguage,
  getUserLoginData,
} from '../utils/AsyncStorageHelper';
import RNRestart from 'react-native-restart';

export default class Language extends React.PureComponent {
  constructor(props) {
    super(props);
    this.title = this.props.navigation.state.params.routeName;
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');

    this.cmsData = {};
    this.fontSize = Platform.OS == 'ios' ? '18px' : '18px';
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
    this.customStyle =
      this.meta +
      '<style>* {max-width: 100%;} body {font-size:' +
      this.fontSize +
      ';}</style>';
  }

  state = {
    switchOn2: false,
    isLoading: false,
    webViewHeight: 100,
    htmlData: '',
  };

  componentDidMount() {
    this.getCMSContent();
    this.CheckLanguage();
  }
  CheckLanguage() {
    getLanguage(
      success => {
        if (success.language == 'arabic') {
          console.log('Sugan', 'arabic true');

          this.state.switchOn2 = true;
        } else {
          console.log('Sugan', 'arabic false');

          this.state.switchOn2 = false;
        }
      },
      failure => {},
    );
  }

  callApiLanguageSetting(launguage) {
    getUserLoginData(
      success => {
        console.log('getUserLoginData', success);
        const param = {
          token: success.PhoneNumber,
          user_id: success.UserID,
          lang: launguage,
        };

        netStatus(status => {
          if (status) {
            this.setState({isLoading: true});
            apiPost(
              LANGUAGE_SETTINGS,
              param,
              response => {
                this.setState({isLoading: false});
                if (response.error != undefined) {
                  showValidationAlert(
                    response.error.message != undefined
                      ? response.error.message
                      : this.MgeneralWebServiceError,
                  );
                } else if (response.status == RESPONSE_SUCCESS) {
                  console.log('callApiLanguageSetting :: :: ', response);
                  RNRestart.Restart();
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
      },
      failure => {
        console.log('getUserLoginData', failure);
      },
    );
  }

  onPress2 = () => {
    this.setState({switchOn2: !this.state.switchOn2});
    if (!this.state.switchOn2) {
      console.log('Sugan', 'arabic');
      let obj = {
        language: 'arabic',
      };
      // en or ar
      saveLanguage(obj, success => {}, errAsyncStore => {});
      // RNRestart.Restart();
      this.callApiLanguageSetting('ar');
    } else {
      console.log('Sugan', 'english');
      let obj = {
        language: 'english',
      };
      saveLanguage(obj, success => {}, errAsyncStore => {});
      // RNRestart.Restart();
      this.callApiLanguageSetting('en');
    }
  };
  getCMSContent() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          CMS_PAGE,
          {
            cms_id: PRIVACY_POLICY,
          },
          success => {
            this.setState({isLoading: false});
            if (success.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
            } else {
              if (success.status == RESPONSE_SUCCESS) {
                this.cmsData = success.cmsData[0];

                this.setState({htmlData: success.cmsData[0]});
              } else {
                showValidationAlert(success.message);
              }
            }
          },
          error => {
            this.setState({isLoading: false});
            showValidationAlert(this.MgeneralWebServiceError, []);
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  render() {
    return (
      <BaseContainer
        title={strings('Language.Language')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        loading={this.state.isLoading}>
        {/* {this.state.isLoading ? <ProgressLoader /> : null} */}
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        > */}
        {/* <View style={{ flex: 1 }}>
        {this.state.htmlData == "" ? null :
          <MyWebView
            source={{
              html: this.customStyle + this.state.htmlData.description
            }}
            startInLoadingState={true}
            style={{ padding: 20 }}
            scrollEnabled={true}
          />
        }
        </View>*/}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 30}}>Arabic</Text>
          <SwitchToggle
            containerStyle={{
              marginTop: 16,
              width: 108,
              height: 48,
              borderRadius: 25,
              backgroundColor: '#ccc',
              padding: 5,
            }}
            circleStyle={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'white', // rgb(102,134,205)
            }}
            switchOn={this.state.switchOn2}
            onPress={this.onPress2}
            circleColorOff="white"
            circleColorOn="red"
            duration={500}
          />
        </View>
        {/* </ScrollView> */}
      </BaseContainer>
    );
  }
}

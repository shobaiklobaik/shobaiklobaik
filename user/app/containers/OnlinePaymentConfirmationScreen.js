import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  View,
  Text,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import BaseContainer from './BaseContainer';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {strings} from '../locales/i18n';
import {Circle} from 'react-native-svg';
import {EDColors} from '../assets/Colors';
import EDThemeButton from '../components/EDThemeButton';
import {ETFonts} from '../assets/FontConstants';
import {netStatus} from '../utils/NetworkStatusConnection';
import {apiPost, apiPostFormData} from '../api/APIManager';
import {
  UPDATE_ORDER_STATUS,
  RESPONSE_SUCCESS,
  ORDER_CONFIRM,
} from '../utils/Constants';
import {showDialogue, showValidationAlert} from '../utils/CMAlert';

import {getUserLoginData} from '../utils/AsyncStorageHelper';
import Toast, {DURATION} from 'react-native-easy-toast';

import ProgressLoader from '../components/ProgressLoader';
import {StackActions, NavigationActions} from 'react-navigation';

class OnlinePaymentConfirmScreen extends Component {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.state = {
      seconds: 21,
      fill: 0,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.interval = setInterval(() => {
      if (this.state.seconds <= 1) {
        clearInterval(this.interval);
        var statusid = 0;
        this.call_Order_ConfirmApi(statusid);
        // this.props.navigation.navigate('OrderConfirm');
      } else {
        this.setState({
          seconds: this.state.seconds - 1,
          fill: this.state.fill + 5,
        });
      }

      console.log('this.state.seconds==>', this.state.seconds);
    }, 1000);
    return () => clearInterval(this.interval);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }
  backAction = () => {
    var statusid = 0;
    this.call_Order_ConfirmApi(statusid);
    // this.props.navigation.navigate('OrderConfirm');
    return true;
  };
  getTimeFormat = seconds => {
    const date = new Date(null);
    date.setSeconds(seconds - 1);
    const result = date.toISOString().substr(14, 5);
    return result;
  };
  call_Order_ConfirmApi = statusid => {
    var order_id = this.props.navigation.getParam('order_id', '');
    console.log('order_id==>', order_id);
    console.log('statusid==>', statusid);
    const param = {
      order_id: order_id,
      order_status: statusid,
    };
    console.log('call_Order_ConfirmApi param', param);

    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          ORDER_CONFIRM,
          param,
          response => {
            console.log('ORDER_CONFIRM ::::::::::::: ', response);
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                clearInterval(this.interval);
                if (statusid === 0) {
                  this.props.navigation.navigate('OrderConfirm');
                  this.setState({isLoading: false});
                } else if (statusid === 1) {
                  this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: 'MainContainer',
                        }),
                      ],
                    }),
                  );
                  showValidationAlert(response.message);
                  this.setState({isLoading: false});
                }
                //
                this.setState({isLoading: false});
              } else {
                showValidationAlert(response.message);
              }
            }
            this.setState({isLoading: false});
          },
          error => {
            showValidationAlert(this.MgeneralWebServiceError);
            this.setState({isLoading: false});
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  };

  _onPressOrderCancel = () => {
    var order_id = this.props.navigation.getParam('order_id', '');
    console.log('order_id==>', order_id);

    getUserLoginData(
      success => {
        console.log('getUserLoginData==>', success);

        const param = {
          entity_id: order_id,
          user_id: success.UserID,
          order_status: 'cancel',
        };
        console.log('param', param);

        netStatus(status => {
          if (status) {
            this.setState({isLoading: true});
            apiPost(
              UPDATE_ORDER_STATUS,
              param,
              response => {
                console.log('UPDATE_ORDER_STATUS ::::::::::::: ', response);
                if (response.error != undefined) {
                  showValidationAlert(
                    response.error.message != undefined
                      ? response.error.message
                      : this.MgeneralWebServiceError,
                  );
                } else {
                  if (response.status == RESPONSE_SUCCESS) {
                    clearInterval(this.interval);
                    var statusid = 1;
                    this.call_Order_ConfirmApi(statusid);
                    // this.props.navigation.dispatch(
                    //   StackActions.reset({
                    //     index: 0,
                    //     actions: [
                    //       NavigationActions.navigate({
                    //         routeName: 'MainContainer',
                    //       }),
                    //     ],
                    //   }),
                    // );
                    // showValidationAlert(response.message);
                    // // this.props.navigation.navigate('OrderConfirm');
                    // this.setState({isLoading: false});
                  } else {
                    showValidationAlert(response.message);
                  }
                }
                this.setState({isLoading: false});
              },
              error => {
                showValidationAlert(this.MgeneralWebServiceError);
                this.setState({isLoading: false});
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
  };

  _onPressContinueWithOrder = () => {
    var statusid = 0;
    this.call_Order_ConfirmApi(statusid);
    // this.props.navigation.navigate('OrderConfirm');
  };
  render() {
    const {percentage} = this.state;
    console.log('this.state.fill==>', this.state.fill);
    return (
      <BaseContainer
        title={strings('PaymentContainer.Confirmation')}
        // left="Back"
        right={[]}
        // onLeft={() => {
        //   this.props.navigation.goBack();
        // }}
      >
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View
          style={{
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View style={{}}>
            <Text
              children={strings('PaymentContainer.Change_mind')}
              style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}
            />
            <Text
              children={strings('PaymentContainer.20_Second_To_Cancel')}
              style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}
            />
          </View>
          <View style={{justifyContent: 'flex-start'}}>
            <AnimatedCircularProgress
              size={150}
              width={8}
              fill={this.state.fill}
              tintColor={EDColors.primary}
              backgroundWidth={8}
              rotation={0}
              backgroundColor={EDColors.borderColor}>
              {fill => {
                return (
                  <Text
                    style={{fontSize: 30, fontWeight: 'bold'}}
                    children={this.getTimeFormat(this.state.seconds)}
                  />
                );
              }}
            </AnimatedCircularProgress>
          </View>

          <View style={{justifyContent: 'flex-start'}}>
            <View style={{marginBottom: 20}}>
              <EDThemeButton
                onPress={() => {
                  this._onPressOrderCancel();
                }}
                label={strings('PaymentContainer.order_cancel')}
              />
            </View>
            <TouchableOpacity
              style={{
                with: 240,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: EDColors.green,
                borderRadius: 5,
              }}
              onPress={() => {
                this._onPressContinueWithOrder();
              }}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: ETFonts.regular,
                  fontSize: 14,
                }}>
                {strings('PaymentContainer.Continue_with_order')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseContainer>
    );
  }
}
export default OnlinePaymentConfirmScreen;

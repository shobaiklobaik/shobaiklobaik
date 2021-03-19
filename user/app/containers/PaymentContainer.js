import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {saveCheckoutDetails, saveCartCount} from '../redux/actions/Checkout';
import {EDColors} from '../assets/Colors';
import {ETFonts} from '../assets/FontConstants';
import BaseContainer from './BaseContainer';
import {Radio} from 'native-base';
import Moment from 'moment';
import {apiPost} from '../api/APIManager';
import {
  ADD_ORDER,
  RESPONSE_SUCCESS,
  INR_SIGN,
  TELR_PAYMENT,
  capiString,
} from '../utils/Constants';
import {showDialogue, showValidationAlert} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import ProgressLoader from '../components/ProgressLoader';
import {clearCartData} from '../utils/AsyncStorageHelper';
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import PriceDetail from '../components/PriceDetail';

export class PaymentContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.CheckLanguage();

    this.checkoutDetail = this.props.checkoutDetail;
    this.OTP = strings('PaymentContainer.OTP');
  }

  state = {
    language: '',
    isLoading: false,
    cashonDeliveryRadio: true,
    onlinePaymentRadio: false,
    OrderId: undefined,
    break_ups: undefined,
  };

  componentDidMount() {
    netStatus(status => {
      if (status) {
        console.log('ADD ORDER REQUEST ::::::::::::: ', this.checkoutDetail);
        this.setState({isLoading: true});
        apiPost(
          ADD_ORDER,
          this.checkoutDetail,
          response => {
            console.log('ORDER SUCCESS ::::::::::::: ', response);
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                const order_id_Data = response.order_id;
                this.setState(
                  {
                    OrderId: order_id_Data ? order_id_Data : undefined,
                    break_ups: response.break_ups,
                  },
                  () => {
                    console.log('this.state.OrderId : ', this.state.OrderId);
                    this.setState({
                      isLoading: false,
                    });
                  },
                );
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

  placeOrder() {
    // this.props.navigation.navigate('OrderConfirm');
    console.log('placeOrder click OrderId::=>', this.state.OrderId);
    if (this.state.OrderId != undefined) {
      if (this.state.cashonDeliveryRadio) {
        netStatus(status => {
          if (status) {
            clearCartData(
              response => {
                this.props.navigation.navigate(
                  'OnlinePaymentConfirmationScreen',
                  {
                    order_id: this.state.OrderId,
                  },
                );
              },
              error => {},
            );
          } else {
            showValidationAlert(this.MinternetConnnection);
          }
        });
      } else if (this.state.onlinePaymentRadio) {
        netStatus(status => {
          if (status) {
            this.setState({isLoading: true});
            const param = {order_id: this.state.OrderId};
            apiPost(
              TELR_PAYMENT,
              param,
              response => {
                console.log('TELR_PAYMENT get url ::::::::::::: ', response);
                if (response.status == 1) {
                  this.props.navigation.navigate('OnlinepaymentContainer', {
                    PaymentGateWayURL: response.url,
                    order_id: this.state.OrderId,
                  });
                  this.setState({isLoading: false});
                } else {
                  showValidationAlert(this.MgeneralWebServiceError);
                  this.setState({isLoading: false});
                }
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
      }
    }
  }

  onPressCashonDelivery = () => {
    this.setState({
      cashonDeliveryRadio: true,
      onlinePaymentRadio: false,
    });
  };

  onPressOnlinePayment = () => {
    this.setState({
      cashonDeliveryRadio: false,
      onlinePaymentRadio: true,
    });
  };

  render() {
    var cartResponse = this.props.navigation.getParam('cartResponse', '');
    console.log('cartResponse paymentcontainer:', this.state.break_ups);
    return (
      <BaseContainer
        title={strings('PaymentContainer.Payment')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}

        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.onPressCashonDelivery();
            }}>
            <View style={style.subContainer}>
              <Text style={style.paymentMethodTitle}>
                {strings('PaymentContainer.Cash')}
              </Text>

              <Radio
                selectedColor="#000"
                style={{margin: 10}}
                selected={this.state.cashonDeliveryRadio}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onPressOnlinePayment();
            }}>
            <View style={style.subContainer}>
              <Text style={style.paymentMethodTitle}>
                {strings('PaymentContainer.onlinePayment')}
              </Text>

              <Radio
                selectedColor="#000"
                style={{margin: 10}}
                selected={this.state.onlinePaymentRadio}
              />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.break_ups != undefined && (
          <View style={style.priceContainer}>
            <Text style={style.title}>
              {strings('CartContainer.PriceDetails')}
            </Text>
            <View style={style.divider} />

            <PriceDetail
              title={strings('PaymentContainer.Sub_Total')}
              price={
                this.state.break_ups.subtotal
                  ? INR_SIGN + ' ' + this.state.break_ups.subtotal
                  : INR_SIGN + ' ' + '00'
              }
            />
            {this.state.break_ups.discount != undefined ? (
              <PriceDetail
                title={strings('PaymentContainer.Discount')}
                price={
                  this.state.break_ups.service_fee
                    ? INR_SIGN + ' ' + this.state.break_ups.discount
                    : INR_SIGN + ' ' + '00'
                }
              />
            ) : null}

            <PriceDetail
              title={strings('PaymentContainer.Service_Fee')}
              price={
                this.state.break_ups.service_fee
                  ? INR_SIGN + ' ' + this.state.break_ups.service_fee
                  : INR_SIGN + ' ' + '00'
              }
            />
            <PriceDetail
              title={strings('PaymentContainer.Delivery_Fee')}
              price={
                this.state.break_ups.delivery_fee
                  ? INR_SIGN + ' ' + this.state.break_ups.delivery_fee
                  : INR_SIGN + ' ' + '00'
              }
              itemTitle={style.itemTitle}
              priceTitle={style.priceTitle}
            />
            <View style={style.divider} />

            <PriceDetail
              title={strings('PaymentContainer.Total')}
              price={
                this.state.break_ups.total_amount
                  ? INR_SIGN + ' ' + this.state.break_ups.total_amount
                  : INR_SIGN + ' ' + '00'
              }
              priceTitle={style.priceTitle}
              itemTitle={style.itemTitle}
            />
          </View>
        )}
        {this.state.break_ups != undefined && (
          <View style={style.checkOutContainer}>
            <Text style={style.totalPrice}>
              {this.state.break_ups.total_amount
                ? INR_SIGN + ' ' + this.state.break_ups.total_amount
                : INR_SIGN + ' ' + '00'}
            </Text>
            <TouchableOpacity
              style={style.roundButton}
              onPress={() => {
                this.props.saveCartCount(0);
                // this.checkoutDetail.order_date = Moment(new Date()).format(
                //   'DD-MM-YYYY hh:mm A',
                // );
                // console.log(
                //   'date 24',
                //   Moment(new Date()).format('DD-MM-YYYY HH:MM'),
                // );

                this.placeOrder();
              }}>
              <Text style={style.button}>
                {strings('PaymentContainer.CONTINUE')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </BaseContainer>
    );
  }
}

export const style = StyleSheet.create({
  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    textAlign: 'left',
    margin: 10,
  },
  title: {
    fontFamily: ETFonts.bold,
    color: '#000',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    textAlign: 'left',
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontFamily: ETFonts.bold,
    textAlign: 'left',
    fontSize: 15,
    // fontWeight: 'bold',
  },
  priceTitle: {
    fontFamily: ETFonts.bold,
    fontSize: 15,
    // fontWeight: 'bold',
  },
  divider: {
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#000',
    textAlign: 'left',
    height: 1,
  },
  subContainer: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    justifyContent: 'center',
  },
  totalPrice: {
    flex: 1,
    fontFamily: ETFonts.regular,
    fontSize: 20,
    alignSelf: 'center',
    marginLeft: 10,
    color: '#000',
  },
  roundButton: {
    alignSelf: 'center',
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4,
  },
  checkOutContainer: {
    flexDirection: 'row',
    marginTop: 100,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  paymentMethodTitle: {
    flex: 1,
    fontFamily: ETFonts.regular,
    fontSize: 18,
    color: '#000',
    margin: 10,
  },
  button: {
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
  },
});

export default connect(
  state => {
    return {
      checkoutDetail: state.checkoutReducer.checkoutDetail,
    };
  },
  dispatch => {
    return {
      saveCheckoutDetails: checkoutData => {
        dispatch(saveCheckoutDetails(checkoutData));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(PaymentContainer);

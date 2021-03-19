import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import BaseContainer from './BaseContainer';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {strings} from '../locales/i18n';
import {Circle} from 'react-native-svg';
import {EDColors} from '../assets/Colors';
import EDThemeButton from '../components/EDThemeButton';
import {ETFonts} from '../assets/FontConstants';
import ProgressLoader from '../components/ProgressLoader';
import {clearCartData} from '../utils/AsyncStorageHelper';
import {StackActions, NavigationActions} from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast';

class OnlinePaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.order_id_param = this.props.navigation.getParam('order_id', '');
  }
  componentDidMount() {}

  render() {
    var PaymentGateWayURL = this.props.navigation.getParam(
      'PaymentGateWayURL',
      '',
    );
    console.log('PaymentGateWayURL==>', PaymentGateWayURL);
    var order_id_Data = this.props.navigation.getParam('order_id', '');
    console.log('order_id==>', order_id_Data);
    return (
      <BaseContainer
        title={strings('PaymentContainer.Confirmation')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        <Toast ref="toast" position="center" fadeInDuration={0} />

        <WebView
          ref={r => (this.webref = r)}
          source={{uri: PaymentGateWayURL}}
          scalesPageToFit
          style={
            this.state.loading
              ? {flex: 0, height: 1, marginTop: Platform.OS === 'ios' ? 20 : 0}
              : styles.WebViewStyle
          }
          javaScriptEnabled={true}
          // startInLoadingState={true}
          onLoadEnd={() => this.setState({isLoading: false})}
          onNavigationStateChange={navState => {
            console.log('navState:: ', navState);
            // "https://www.shobaiklobaik.com/demo/telrpayment-status?lang=en&status=Success&order_id=930"
            // "https://www.shobaiklobaik.com/demo/telrpayment-status?lang=en&status=Cancelled&order_id=933"
            // setCanGoBack(navState.canGoBack)
            // setCanGoForward(navState.canGoForward)
            // setCurrentUrl(navState.url)
            var checkUrlSuccessFailed = navState.url.includes(`status=Success`);
            // var checkUrlSuccessFailed = navState.url.includes('Success');
            var orderIdCheck = navState.url.includes(
              `order_id=${order_id_Data}`,
            );
            console.log('checkUrlSuccessFailed', checkUrlSuccessFailed);
            console.log('orderIdCheck', orderIdCheck);

            if (orderIdCheck) {
              if (checkUrlSuccessFailed) {
                console.log('success payment');
                this.refs.toast.show(
                  'Payment Successfully...!!',
                  DURATION.LENGTH_SHORT,
                );
                clearCartData(
                  response => {
                    this.timeoutHandle = setTimeout(() => {
                      console.log('this.order_id_param', this.order_id_param);
                      // this.props.navigation.dispatch(
                      //   StackActions.reset({
                      //     index: 0,
                      //     actions: [
                      //       NavigationActions.navigate(
                      //         {routeName: 'OnlinePaymentConfirmationScreen'},
                      //         {
                      //           order_id: this.order_id_param,
                      //         },
                      //       ),
                      //     ],
                      //   }),
                      // );
                      this.props.navigation.navigate(
                        'OnlinePaymentConfirmationScreen',
                        {
                          order_id: order_id_Data,
                        },
                      );
                    }, 3000);
                  },
                  error => {},
                );
              } else {
                console.log('failed payment');
                this.refs.toast.show(
                  'Payment Failed...!!',
                  DURATION.LENGTH_SHORT,
                );

                this.timeoutHandle = setTimeout(() => {
                  this.props.navigation.navigate('CartContainer');
                }, 4000);
              }
            }
          }}
        />
        {this.state.isLoading ? <ProgressLoader /> : null}
      </BaseContainer>
    );
  }
}
export default OnlinePaymentScreen;
const styles = StyleSheet.create({
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

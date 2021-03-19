import React from 'react';
import {View, Text, Image, StyleSheet, BackHandler} from 'react-native';
import BaseContainer from './BaseContainer';
import ProgressLoader from '../components/ProgressLoader';
import Assets from '../assets';
import {ETFonts} from '../assets/FontConstants';
import EDThemeButton from '../components/EDThemeButton';
import {connect} from 'react-redux';
import {saveCartCount} from '../redux/actions/Checkout';
import {apiPost} from '../api/APIManager';
import {CHECK_ORDER_DELIVERED_URL} from '../utils/Constants';
import NavigationService from '../../NavigationService';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

class OrderConfirm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.CheckLanguage();
  }

  state = {
    language: '',
    isLoading: false,
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  backAction = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('Order');
    return true;
  };
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
  orderDelivered = () => {
    let param = {
      language: this.state.language,
      token: '',
      user_id: '',
      order_id: '',
      is_delivered: '',
      reason: '',
    };

    apiPost(CHECK_ORDER_DELIVERED_URL, param, onSuccess => {}, onFailure => {});
  };

  render() {
    return (
      <BaseContainer
        title={strings('OrderConfirm.Confirmation')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.popToTop();
          this.props.navigation.navigate('Order');
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{flex: 1}}>
          <Image
            source={Assets.confirm_background}
            style={{
              flex: 1,
              width: '100%',
            }}
          />

          <View style={style.container}>
            <View style={style.subContainer}>
              <Image
                style={{alignSelf: 'center'}}
                source={Assets.confirm_thumb}
              />
            </View>

            <View style={{flex: 1, marginTop: 10, alignItems: 'center'}}>
              <Text style={style.thankyouText}>
                {strings('OrderConfirm.Thank')}
              </Text>

              <View style={{marginTop: 20}}>
                <EDThemeButton
                  label={strings('OrderConfirm.TRACKYOURORDER')}
                  onPress={() => {
                    this.props.saveCartCount(0);
                    this.props.navigation.popToTop();
                    this.props.navigation.navigate('Order');
                    // NavigationService.navigate("Order")
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux,
      cartCount: state.checkoutReducer.cartCount,
    };
  },
  dispatch => {
    return {
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(OrderConfirm);

export const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  thankyouText: {
    fontFamily: ETFonts.satisfy,
    fontSize: 20,
    color: '#000',
    marginTop: 20,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

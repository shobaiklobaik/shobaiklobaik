import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import BaseContainer from './BaseContainer';
import {ETFonts} from '../assets/FontConstants';
import {EDColors} from '../assets/Colors';
import {apiPost} from '../api/APIManager';
import {
  PROMO_CODE_LIST,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
} from '../utils/Constants';
import {showValidationAlert} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import {connect} from 'react-redux';
import {saveCheckoutDetails} from '../redux/actions/Checkout';
import ProgressLoader from '../components/ProgressLoader';
import {netStatus} from '../utils/NetworkStatusConnection';
import MyWebView from 'react-native-webview';
import metrics from '../utils/metrics';
import Assets from '../assets';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

class PromoCode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.CheckLanguage();

    this.couponList = [];
    this.webviewData = undefined;
  }

  state = {
    language: '',
    isLoading: false,
    getData: this.props.navigation.state.params.getData,
    resId: this.props.navigation.state.params.resId,
    edValue: '',
    isDetailVisible: false,
  };

  componentDidMount() {
    this.getPromoCodeList();
  }

  applyFilter(data) {
    if (this.state.getData != undefined) {
      this.state.getData(data);
    }
    this.props.navigation.goBack();
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
  getPromoCodeList() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          PROMO_CODE_LIST,
          {
            language: this.state.language,
            token: this.props.token,
            user_id: this.props.userID,
            restaurant_id: this.props.navigation.state.params.resId,
            subtotal: this.props.navigation.state.params.subTotal,
          },
          success => {
            if (success.status == RESPONSE_SUCCESS) {
              this.couponList = success.coupon_list;
            } else if (success.status == RESPONSE_FAIL) {
              showValidationAlert(success.message);
            }
            this.setState({isLoading: false});
          },
          error => {
            this.setState({isLoading: false});
            showValidationAlert(
              error.response != undefined
                ? error.response
                : this.MgeneralWebServiceError,
              [],
            );
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
        title={strings('PromoCode.PromoCode')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        {this.promoCodeDetail()}
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              borderRadius: 6,
              margin: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <TextInput
              style={{
                flex: 1,
                fontFamily: ETFonts.regular,
                paddingLeft: 10,
                color: '#000',
              }}
              placeholderTextColor="#C7C7CD"
              keyboardType="default"
              secureTextEntry={false}
              onChangeText={userText => {
                this.setState({edValue: userText});
              }}
              value={this.props.edValue}
            />
            <TouchableOpacity
              style={style.roundButton}
              onPress={() => {
                this.applyFilter(this.state.edValue);
              }}>
              <Text style={style.apply}>APPLY</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={this.couponList}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    margin: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: ETFonts.regular,
                        color: '#000',
                        fontSize: 15,
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: ETFonts.primary,
                        color: EDColors.primary,
                        fontSize: 15,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                      onPress={() => {
                        this.applyFilter(item.name);
                      }}>
                      APPLY
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: ETFonts.primary,
                      fontSize: 15,
                      color: EDColors.primary,
                      paddingLeft: 10,
                      paddingBottom: 10,
                    }}
                    onPress={() => {
                      if (
                        item.description != undefined &&
                        item.description != '' &&
                        item.description != null
                      ) {
                        this.webviewData = item.description;
                        this.setState({isDetailVisible: true});
                      }
                    }}>
                    More Detail
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item, index) => item + index}
          />
        </ScrollView>
      </BaseContainer>
    );
  }

  promoCodeDetail() {
    return (
      <Modal
        visible={this.state.isDetailVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({isDetailVisible: false});
        }}>
        <View style={style.modalContainer}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => {
              this.setState({isDetailVisible: false});
            }}>
            <FastImage
              style={{alignSelf: 'center', height: 15, width: 15}}
              source={Assets.ic_close}
            />
          </TouchableOpacity>

          <MyWebView
            source={{html: this.webviewData}}
            startInLoadingState={true}
            style={{
              backgroundColor: '#fff',
              alignSelf: 'center',
              margin: 10,
              width: Dimensions.get('window').width - 60,
            }}
            hasIframe={true}
            scrollEnabled={true}
          />
        </View>
      </Modal>
    );
  }
}

export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux,
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
)(PromoCode);

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    margin: 10,
  },
  roundButton: {
    alignSelf: 'center',
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4,
  },
  button: {
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
  },
  apply: {
    padding: 10,
    color: '#fff',
    fontFamily: ETFonts.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    marginBottom: 20,
    marginTop: metrics.statusbarHeight,
    // backgroundColor: "rgba(0,0,0,0.50)"
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
    color: 'red',
    flexDirection: 'column',
  },
  webview: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingBottom: 15,
    width: Dimensions.get('window').width - 60,
  },
});

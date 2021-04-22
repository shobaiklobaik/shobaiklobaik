import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import BaseContainer from './BaseContainer';
import {showDialogue, showValidationAlert} from '../utils/CMAlert';
import {ETFonts} from '../assets/FontConstants';
import ProgressLoader from '../components/ProgressLoader';
import {apiPost} from '../api/APIManager';
import {GET_NOTIFICATION, RESPONSE_SUCCESS} from '../utils/Constants';
import {connect} from 'react-redux';
//import { Messages } from "../utils/Messages";
import {netStatus} from '../utils/NetworkStatusConnection';
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import Assets from '../assets/index';
import FastImage from 'react-native-fast-image';

class NotificationList extends React.PureComponent {
  constructor(props) {
    super(props);

    // this.notificationList = [];
    this.page_no = 1;
    this.isScrolling = false;
    this.CheckLanguage();

    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
  }

  state = {
    language: '',

    isLoading: false,
    notificationList: undefined,
  };

  componentDidMount() {
    this.getNotificationList();
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
  getNotificationList() {
    netStatus(status => {
      if (status) {
        if (
          this.props.token != '' &&
          this.props.token != undefined &&
          this.props.token.length > 0
        ) {
          this.setState({isLoading: true});
          apiPost(
            GET_NOTIFICATION,
            {
              // language: this.state.language,
              // token: this.props.token,
              // user_id: this.props.userID,
              // count: 9,
              // page_no: this.page_no,
              user_id: this.props.userID,
              token: this.props.token,
            },
            response => {
              if (response.status == RESPONSE_SUCCESS) {
                if (
                  response.notification != undefined &&
                  response.notification.length > 0
                ) {
                  if (
                    this.state.notificationList != undefined &&
                    response.notification.length >= 20 &&
                    response.notificaion_count != this.state.notificationList
                  ) {
                    this.page_no = this.page_no + 1;
                    this.isScrolling = true;
                  } else {
                    this.isScrolling = false;
                  }

                  if (
                    response.notification.length > 0 &&
                    this.state.notificationList == undefined
                  ) {
                    this.state.notificationList = [];
                  }

                  this.setState({
                    notificationList: [
                      ...this.state.notificationList,
                      ...response.notification,
                    ],
                  });
                } else {
                  this.setState({notificationList: []});
                }
              } else {
                showValidationAlert(response.message);
              }
              this.setState({isLoading: false});
            },
            error => {
              this.setState({isLoading: false});
              showValidationAlert(this.MgeneralWebServiceError);
              console.log("notification err",error)
            },
          );
        } else {
          showValidationAlert(this.MloginValidation);
        }
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  emptyView() {
    // return <Text style={style.emptyCartText}>No Data Found</Text>;
    return (
      <View style={style.emptyCartText}>
        <DataNotAvailableContainer />
      </View>
    );
  }

  render() {
    return (
      <BaseContainer
        title={strings('NotificationList.Notification')}
        left="Menu"
        right={[]}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{flex: 1}}>
          {this.state.notificationList != undefined &&
          this.state.notificationList.length > 0 ? (
            <FlatList
              data={this.state.notificationList}
              showsVerticalScrollIndicator={false}
              extraData={this.state}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      width: '95%',
                      marginVertical: 10,
                      // padding: 10,
                      borderRadius: 6,
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        width: '30%',
                      }}>
                      <Image
                        style={{
                          alignSelf: 'center',
                          width: 100,
                          height: 100,
                          resizeMode: 'contain',
                        }}
                        source={Assets.notiicon}
                      />
                    </View>

                    <View
                      style={{
                        width: '70%',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontFamily: ETFonts.regular,
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        {item?.notification_title}
                      </Text>

                      <Text
                        style={{
                          color: '#000',
                          fontFamily: ETFonts.regular,
                          fontSize: 14,
                        }}>
                        {item?.notification_description}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontFamily: ETFonts.regular,
                          fontSize: 14,
                        }}>
                        {item?.created_date}
                      </Text>
                    </View>
                  </View>
                );
              }}
              onEndReached={() => {
                if (this.isScrolling) {
                  this.getNotificationList();
                }
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => item + index}
            />
          ) : this.state.notificationList != undefined &&
            this.state.notificationList.length <= 0 ? (
            this.emptyView()
          ) : null}
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
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
    };
  },
)(NotificationList);

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'relative',
    marginTop: -30,
    marginBottom: 10,
  },
  emptyCartText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    color: '#000',
    fontSize: 15,
    fontFamily: ETFonts.regular,
  },
});

import React from 'react';
import {View, ScrollView, StyleSheet, FlatList} from 'react-native';
import BaseContainer from './BaseContainer';
import {EDColors} from '../assets/Colors';
import {
  RESPONSE_SUCCESS,
  BOOKING_HISTORY,
  DELETE_EVENT,
} from '../utils/Constants';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {apiPost} from '../api/ServiceManager';
import BookedEventCard from '../components/BookedEventCard';
import ProgressLoader from '../components/ProgressLoader';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';

export default class MyBookingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',

      isLoading: false,
      isRefreshing: false,
      selectedIndex: 0,
    };
    this.cancel = strings('MyBookingContainer.cancel');
    this.Upcoming = strings('MyBookingContainer.Upcoming');
    this.Past = strings('MyBookingContainer.Past');
    this.CheckLanguage();

    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.MdeleteEvent = strings('Messages.deleteEvent');

    
  }

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index,
    });
  };
  onFocusFunction = () => {
    // do some stuff on every screen focus
    console.log('onFocusFunction call');
    this.checkUser();
  };
  componentDidMount() {
    console.log('call componetdidmount');
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  checkUser() {
    getUserToken(
      success => {
        userObj = success;
        this.loadData(success);
      },
      failure => {
        showValidationAlert(this.MloginValidation);
      },
    );
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
  loadData(userObj) {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          BOOKING_HISTORY,
          {
            language: this.state.language,
            user_id: parseInt(userObj.UserID) || 0,
            token: '' + userObj.PhoneNumber,
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                console.log('resp : : :', resp);
                this.arrayUpcoming = resp.upcoming_booking;
                this.arrayPast = resp.past_booking;
                this.setState({isLoading: false});
              } else {
                showValidationAlert(resp.message);
                this.setState({isLoading: false});
              }
            } else {
              // showValidationAlert(this.MgeneralWebServiceError);
              this.setState({isLoading: false});
            }
          },
          err => {
            this.setState({isLoading: false});
            // showValidationAlert(this.MinternetConnnection);
          },
        );
      } 
      else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  deleteEvent(userObj, eventId) {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          DELETE_EVENT,
          {
            language: this.state.language,
            user_id: parseInt(userObj.UserID) || 0,
            token: '' + userObj.PhoneNumber,
            event_id: eventId,
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.loadData(userObj);
              } else {
                showValidationAlert(resp.message);
                this.setState({isLoading: false});
              }
            } else {
              // showValidationAlert(this.MgeneralWebServiceError);
              this.setState({isLoading: false});
            }
          },
          err => {
            this.setState({isLoading: false});
            // showValidationAlert(this.MinternetConnnection);
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
        title={strings('MyBookingContainer.MyBooking')}
        left="Menu"
        right={[]}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View
              style={{
                margin: 10,
              }}>
              <SegmentedControlTab
                values={[this.Upcoming, this.Past]}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange}
                backgroundColor={EDColors.primary}
                tabStyle={styles.tabStyle}
                tabTextStyle={styles.tabTextStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTabTextStyle={styles.activeTabTextStyle}
                allowFontScaling={false}
                borderColor={EDColors.primary}
              />
              {this.state.selectedIndex == 0 ? (
                <View style={{flex: 1}}>
                  {this.arrayUpcoming != undefined &&
                  this.arrayUpcoming != null &&
                  this.arrayUpcoming.length > 0 ? (
                    <FlatList
                      data={this.arrayUpcoming}
                      showsHorizontalScrollIndicator={false}
                      refreshing={this.state.isLoading}
                      onRefresh={() => this.checkUser()}
                      renderItem={({item, index}) => {
                        return (
                          <BookedEventCard
                            pkgImage={item.image}
                            RestaurantName={item.name}
                            address={item.address}
                            pos={index}
                            rating={item.rating}
                            timing={item.booking_date}
                            people={item.no_of_people}
                            onPress={pos => {
                              showDialogue(
                                this.MdeleteEvent,
                                [
                                  {
                                    text: this.cancel,
                                  },
                                ],
                                '',
                                () => this.deleteEvent(userObj, item.entity_id),
                              );
                            }}
                            isSelected={true}
                            onReview={count => {}}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : this.state.isLoading ? (
                    <View />
                  ) : (
                    <DataNotAvailableContainer />
                  )}
                </View>
              ) : (
                <View style={{flex: 1}}>
                  {this.arrayPast != undefined &&
                  this.arrayPast != null &&
                  this.arrayPast.length > 0 ? (
                    <FlatList
                      data={this.arrayPast}
                      refreshing={this.state.isLoading}
                      onRefresh={() => this.checkUser()}
                      renderItem={({item, index}) => {
                        return (
                          <BookedEventCard
                            pkgImage={item.image}
                            RestaurantName={item.name}
                            address={item.address}
                            pos={index}
                            rating={item.rating}
                            timing={item.booking_date}
                            people={item.no_of_people}
                            onPress={pos => {}}
                            isSelected={false}
                            onReview={count => {}}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : (
                    <DataNotAvailableContainer />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabsContainerStyle: {
    //custom styles
    backgroundColor: EDColors.primary,
    alignSelf: 'flex-start',
  },
  tabStyle: {
    //custom styles
    backgroundColor: EDColors.white,
    borderColor: EDColors.primary,
    alignSelf: 'flex-start',
  },
  tabTextStyle: {
    //custom styles
    color: EDColors.primary,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-start',
  },
  activeTabStyle: {
    //custom styles
    backgroundColor: EDColors.primary,
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
});

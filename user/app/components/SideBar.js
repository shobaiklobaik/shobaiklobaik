import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Linking,
  View,
} from 'react-native';
import styles from '../stylesheet/stylesheet';
import Assets from '../assets';
import {connect} from 'react-redux';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import {EDColors} from '../assets/Colors';
import {getUserToken, flushAllData} from '../utils/AsyncStorageHelper';
import {ETFonts} from '../assets/FontConstants';
import {saveUserDetailsInRedux} from '../redux/actions/User';
import {NavigationActions} from 'react-navigation';
import Share from 'react-native-share';
import {capiString, LOGIN_URL, LOGOUT_URL} from '../utils/Constants';
import {saveCartCount} from '../redux/actions/Checkout';
import {apiPost} from '../api/APIManager';
import {strings} from '../locales/i18n';
import FastImage from 'react-native-fast-image';

class SideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.Welcome = strings('SideBar.Welcome');
    this.Welcomeg = strings('SideBar.Welcomeg');
    this.SignOut = strings('SideBar.SignOut');
    this.RateUs = strings('SideBar.RateUs');
    this.ShareUs = strings('SideBar.Shareus');

    (this.arrayFinalSideMenu = []),
      (this.sideMenuData = {
        routes: [
          'Home',
          'Recipe',
          'Order',
          'Event',
          'MyBooking',
          'Notification',
          'Rate',
          'Share',
          'PrivacyPolicy',
          'Language',
          'CMSContainer',
          'CMSContainer',
          // this.props.userToken != undefined ? "Signout" : ""
        ],
        screenNames: [
          strings('SideBar.Home'),
          strings('SideBar.Recipe'),
          strings('SideBar.Order'),
          strings('SideBar.EventBooking'),
          strings('SideBar.MyBooking'),
          strings('SideBar.Notification'),
          strings('SideBar.RateUs'),
          strings('SideBar.Shareus'),
          strings('SideBar.PrivacyPolicy'),
          strings('SideBar.Language'),
          strings('SideBar.AboutUs'),
          strings('SideBar.ContactUs'),
          // this.props.userToken != undefined ? "Sign out" : ""
        ],
        icons: [
          Assets.home_deselect,
          Assets.recipe_deselect,
          Assets.order_deselect,
          Assets.eventbooking_deselect,
          Assets.mybooking_deselect,
          Assets.notification_deselect,
          Assets.rateus_deselect,
          Assets.shareus_deselect,
          Assets.privacypolicy_deselect,
          Assets.order_deselect,
          Assets.aboutus_deselect,
          Assets.contactus_deselect,
          this.props.userToken != undefined
            ? Assets.signout_deselect
            : undefined,
        ],
        iconsSelected: [
          Assets.home_select,
          Assets.recipe_select,
          Assets.order_select,
          Assets.eventbooking_select,
          Assets.mybooking_select,
          Assets.notification_select,
          Assets.rateus_select,
          Assets.shareus_select,
          Assets.privacypolicy_select,
          Assets.order_select,
          Assets.aboutus_select,
          Assets.contactus_select,
          this.props.userToken != undefined ? Assets.signout_select : undefined,
        ],
      });
  }

  getData() {
    getUserToken(
      success => {
        userObj = success;

        this.setState({
          firstName: userObj.FirstName || '',
          lastName: userObj.LastName || '',
          // image: userObj.image || Assets.user_placeholder
          image: userObj.image,
        });
      },
      failure => {},
    );
  }
  state = {
    is_updated: false,
    firstName: '',
    lastName: '',
    image: '',
    isLogout: false,
  };

  componentDidMount() {}

  render() {
    this.props.navigation.addListener('didFocus', payload => {
      console.log('did focus call sidebar');
      this.getData();
      this.setState({is_updated: true});
    });
    this.arrayFinalSideMenu =
      this.props.userToken != undefined
        ? this.sideMenuData.screenNames.concat(this.SignOut)
        : this.sideMenuData.screenNames;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F5F5F5',
        }}>
        {this.logoutDialog()}
        <TouchableOpacity
          style={{flex: 2}}
          activeOpacity={1.0}
          onPress={() => {
            if (
              this.state.firstName != '' &&
              this.state.firstName != undefined
            ) {
              this.props.navigation.navigate('ProfileContainer');
            } else {
              this.props.navigation.navigate('LoginContainer');
            }
          }}>
          <View style={styles.navHeader}>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontSize: 16,
                fontFamily: ETFonts.bold,
                color: '#fff',
              }}>
              {this.state.firstName != '' && this.state.firstName != undefined
                ? this.Welcome +
                  ' ' +
                  capiString(this.state.firstName + ' ' + this.state.lastName)
                : this.Welcomeg}
            </Text>

            <Image
              source={
                this.state.image != null && this.state.image != ''
                  ? {uri: this.state.image}
                  : Assets.user_placeholder
              }
              style={{
                borderWidth: 5,
                borderColor: '#fff',
                width: 100,
                height: 100,
                backgroundColor: '#fff',
                borderRadius: 50,
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.navItemContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.arrayFinalSideMenu}
            extraData={this.state}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index}) => {
              if (item != undefined) {
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                      marginLeft: 25,
                      marginBottom: 15,
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();

                      if (this.arrayFinalSideMenu[index] == this.SignOut) {
                        this.setState({isLogout: true});
                      } else if (
                        this.arrayFinalSideMenu[index] == this.RateUs
                      ) {
                        this.openStore();
                      } else if (
                        this.arrayFinalSideMenu[index] == this.ShareUs
                      ) {
                        this.shareApp();
                      } else {
                        this.props.saveNavigationSelection(
                          this.sideMenuData.routes[index],
                        );

                        // this.props.navigation.navigate(
                        //   this.sideMenuData.routes[index],
                        //   {
                        //     routeName: this.arrayFinalSideMenu[index]
                        //   }
                        // );
                        console.log(
                          'Data',
                          'routeName: ' +
                            this.sideMenuData.routes[index] +
                            ' params:  ' +
                            this.arrayFinalSideMenu[index],
                        );
                        this.props.navigation.dispatch(
                          NavigationActions.navigate({
                            routeName: this.sideMenuData.routes[index], // <==== this is stackNavigator
                            params: {
                              routeName: this.arrayFinalSideMenu[index],
                            },
                            action: NavigationActions.navigate({
                              routeName: this.sideMenuData.routes[index],
                              params: {
                                routeName: this.arrayFinalSideMenu[index],
                              }, // <===== this is defaultScreen for Portfolio
                            }),
                          }),
                        );
                      }
                    }}>
                    <FastImage
                      style={{width: 23, height: 15}}
                      source={
                        this.props.titleSelected ==
                        this.sideMenuData.routes[index]
                          ? this.sideMenuData.iconsSelected[index] || -1
                          : this.sideMenuData.icons[index] || -1
                      }
                      resizeMode="contain"
                    />

                    <Text
                      style={{
                        color:
                          this.props.titleSelected ==
                          this.sideMenuData.routes[index]
                            ? EDColors.primary
                            : '#000',
                        fontSize: 16,
                        marginLeft: 10,
                        fontFamily: ETFonts.regular,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            }}
            ListFooterComponent={() => {
              return (
                <View style={{alignSelf: 'center'}}>
                  <Text style={{fontSize: 16, color: 'grey'}}>
                    {'version 2.0'}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }

  openStore() {
    const APP_STORE_LINK = 'itms-apps://apps.apple.com/app/id1501690289';
    const PLAY_STORE_LINK = 'market://details?id=com.shobaik.lobaik.users';

    if (Platform.OS == 'ios') {
      Linking.openURL(APP_STORE_LINK).catch(err => {});
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch(err => {});
    }
  }

  shareApp() {
    const APP_STORE_LINK = 'https://apps.apple.com/app/id1501690289';
    const PLAY_STORE_LINK =
      'https://play.google.com/store/apps/details?id=com.shobaik.lobaik.users';

    const shareOptions = {
      title: 'Share Shobaik Lobaik User Application',
      url: Platform.OS == 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK,
    };
    Share.open(shareOptions);
  }

  logoutDialog() {
    return (
      <Modal
        visible={this.state.isLogout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({isLogout: false});
        }}>
        <View style={style.modalContainer}>
          <View style={style.modalSubContainer}>
            <Text style={style.deleteTitle}>{strings('SideBar.Are')}</Text>

            <View style={style.optionContainer}>
              <Text
                style={style.deleteOption}
                onPress={() => {
                  let params = {
                    token: this.props.token,
                    user_id: this.props.userID,
                  };

                  apiPost(
                    LOGOUT_URL,
                    params,
                    success => {
                      this.props.saveCredentials({
                        phoneNumberInRedux: undefined,
                        userIdInRedux: undefined,
                      });
                      flushAllData(
                        response => {
                          this.props.saveCartCount(0);
                          this.props.navigation.popToTop();
                          this.props.navigation.navigate('InitialContainer');
                        },
                        error => {},
                      );
                      this.state.firstName = '';
                      this.state.lastName = '';
                      this.state.image = '';
                      this.setState({isLogout: false});
                    },
                    failure => {
                      this.setState({isLogout: false});
                    },
                  );
                }}>
                {strings('SideBar.Yes')}
              </Text>

              <Text
                style={style.deleteOption}
                onPress={() => {
                  this.setState({isLogout: false});
                }}>
                {strings('SideBar.No')}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  deleteTitle: {
    fontFamily: ETFonts.bold,
    fontSize: 15,
    color: '#000',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteOption: {
    fontFamily: ETFonts.bold,
    fontSize: 12,
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    backgroundColor: EDColors.primary,
  },
});

export default connect(
  state => {
    return {
      titleSelected: state.navigationReducer.selectedItem,
      userToken: state.userOperations.phoneNumberInRedux,
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.token,
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCredentials: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(SideBar);

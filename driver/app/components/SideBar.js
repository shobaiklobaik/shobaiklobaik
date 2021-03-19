import React, { Component } from "react";
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
  StatusBar,
  Alert,
} from "react-native";
import styles from "../stylesheet/stylesheet";
import Assets from "../assets";
import { connect } from "react-redux";
import { saveNavigationSelection } from "../redux/actions/Navigation";
import { EDColors } from "../assets/Colors";
import { getUserToken, flushAllData } from "../utils/AsyncStorageHelper";
import { ETFonts } from "../assets/FontConstants";
import {
  saveUserDetailsInRedux,
  saveLogoutInRedux,
} from "../redux/actions/User";
import {
  NavigationActions,
  NavigationEvents,
  StackActions,
} from "react-navigation";
import Share from "react-native-share";
import { capiString, isRTLCheck } from "../utils/Constants";
import { saveCartCount } from "../redux/actions/Checkout";
import metrics from "../utils/metrics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { strings } from "../locales/i18n";
import EDRTLView from "./EDRTLView";

class SideBar extends React.PureComponent {
  constructor(props) {
    super(props);

    (this.arrayFinalSideMenu = []),
      (this.sideMenuData = {
        routes: [
          isRTLCheck() ? "HomeRight" : "Home",
          //  "Home",
          "MyProfile",
          "MyEarning",
          "Notification",
          "changePassword",
          "Language",

          // this.props.userToken != undefined ? "Signout" : ""
        ],
        screenNames: [
          strings("home.title"),
          strings("Profile.title"),
          strings("earning.title"),
          strings("notifiation.title"),
          strings("login.changepassword"),
          strings("Language.title"),
          strings("home.logout"),
        ],
        icons: [
          Assets.home_deselect,
          Assets.profile_deselect,
          Assets.earning_deselect,
          Assets.notification_deselect,
          Assets.changePassword_deselect,
          Assets.order_deselected,
          Assets.logout_deselect,
        ],
        iconsSelected: [
          Assets.home_select,
          Assets.profile_select,
          Assets.earning_select,
          Assets.notification_deselect,
          Assets.changePassword_select,
          Assets.order_deselected,
          Assets.logout_select,
        ],
      });
  }

  getData() {
    // getUserToken(
    //   success => {
    //     userObj = success;

    //     this.setState({
    //       firstName: userObj.FirstName || "",
    //       lastName: userObj.LastName || "",
    //       // image: userObj.image || Assets.user_placeholder
    //       image: userObj.image
    //     });
    //   },
    //   failure => { }
    // );
    this.userDetails = this.props.userData;

    this.setState({
      firstName: this.userDetails.FirstName,
      lastName: this.userDetails.LastName,
      phoneNumber: this.userDetails.PhoneNumber,
      image: this.userDetails.image,
    });
  }
  state = {
    is_updated: false,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    image: "",
    isLogout: false,
  };

  componentDidMount() {}

  render() {
    this.props.navigation.addListener("didFocus", (payload) => {
      console.log("did focus call sidebar");
      this.getData();
      this.setState({ is_updated: true });
    });
    this.arrayFinalSideMenu =
      // this.props.userToken != undefined
      //   ? this.sideMenuData.screenNames.concat("Sign Out")
      // :
      this.sideMenuData.screenNames;
    return (
      <View
        style={{
          flex: 1,
          height: hp("10%"),
          backgroundColor: EDColors.primary,
        }}
      >
        <StatusBar
          barStyle="light-content"
          // backgroundColor="rgba(158,194,42,1.0)"
          backgroundColor={EDColors.primary}
        />
        <View
          style={{
            paddingTop: Platform.OS == "ios" ? 20 : 0,
            flex: 1,
          }}
        >
          <NavigationEvents
            onDidFocus={() => {
              this.sideMenuData = {
                routes: [
                  isRTLCheck() ? "HomeRight" : "Home",
                  //  "Home",
                  "MyProfile",
                  "MyEarning",
                  "Notification",
                  "changePassword",
                  "Language",
                  // this.props.userToken != undefined ? "Signout" : ""
                ],
                screenNames: [
                  // isRTLCheck() ? "HomeRight" : "Home",
                  strings("home.title"),
                  strings("Profile.title"),
                  strings("earning.title"),
                  strings("notifiation.title"),
                  strings("login.changepassword"),
                  strings("Language.title"),
                  strings("home.logout"),
                ],
                icons: [
                  Assets.home_deselect,
                  Assets.profile_deselect,
                  Assets.earning_deselect,
                  Assets.notification_deselect,
                  Assets.changePassword_deselect,
                  Assets.order_deselected,
                  Assets.logout_deselect,
                ],
                iconsSelected: [
                  Assets.home_select,
                  Assets.profile_select,
                  Assets.earning_select,
                  Assets.notification_deselect,
                  Assets.changePassword_select,
                  Assets.order_deselected,
                  Assets.logout_select,
                ],
              };
            }}
          />

          <View style={{ height: metrics.screenHeight * 0.277 }}>
            <View style={style.navHeader}>
              <Image
                source={
                  this.state.image != null && this.state.image != ""
                    ? { uri: this.state.image }
                    : Assets.user_placeholder
                }
                // resizeMode = "contain"
                style={{
                  // alignSelf: isRTLCheck() ? 'flex-end' : 'flex-start',
                  // marginHorizontal: metrics.screenWidth * 0.052,
                  marginTop: metrics.screenHeight * 0.026,
                  borderWidth: 3,
                  borderColor: "#fff",
                  width: metrics.screenWidth * 0.27,
                  height: metrics.screenWidth * 0.27,
                  backgroundColor: "#fff",
                  borderRadius: (metrics.screenWidth * 0.27) / 2,
                }}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  // marginHorizontal:metrics.screenWidth * 0.039
                }}
              >
                <Text
                  style={{
                    // marginTop: 10,
                    fontSize: hp("2.2%"),
                    fontFamily: ETFonts.bold,
                    marginTop: metrics.screenHeight * 0.015,
                    // marginHorizontal: 10,
                    color: "#fff",
                    // borderWidth:1
                  }}
                >
                  {this.state.firstName != "" &&
                  this.state.firstName != undefined
                    ? strings("home.welcome") +
                      ", " +
                      capiString(this.state.firstName)
                    : strings("home.guest")}
                </Text>

                <Text
                  style={{
                    fontSize: hp("2.0%"),
                    fontFamily: ETFonts.bold,
                    marginTop: metrics.screenHeight * 0.015,
                    // marginHorizontal: 10,
                    color: "#fff",
                    // padding: 10,
                  }}
                >
                  {this.state.phoneNumber}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.navItemContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.arrayFinalSideMenu}
              extraData={this.state}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => {
                if (item != undefined) {
                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: isRTLCheck() ? "row-reverse" : "row",
                        alignItems: "center",
                        marginTop: metrics.screenHeight * 0.025,
                        marginHorizontal: metrics.screenWidth * 0.072,
                      }}
                      onPress={() => {
                        this.props.navigation.closeDrawer();

                        if (
                          this.arrayFinalSideMenu[index] ==
                          strings("home.logout")
                        ) {
                          // this.logoutDialog()
                          this.props.saveLogout(true);
                        } else if (
                          this.arrayFinalSideMenu[index] == "Rate Us"
                        ) {
                          this.openStore();
                        } else if (
                          this.arrayFinalSideMenu[index] == "Share us"
                        ) {
                          this.shareApp();
                        } else {
                          this.props.saveNavigationSelection(
                            this.sideMenuData.routes[index]
                          );
                          this.props.navigation.navigate(
                            this.sideMenuData.routes[index]
                          );

                          console.log(
                            "Data",
                            "routeName: " +
                              this.sideMenuData.routes[index] +
                              " params:  " +
                              this.arrayFinalSideMenu[index]
                          );
                        }
                      }}
                    >
                      <Image
                        style={{
                          width: 23,
                          height: 15,
                          tintColor:
                            this.props.titleSelected ==
                            this.sideMenuData.routes[index]
                              ? EDColors.primary
                              : EDColors.text,
                        }}
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
                              : "#000",
                          fontSize: 16,
                          marginLeft: 10,
                          fontFamily: ETFonts.regular,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return null;
                }
              }}
            />
            {/* <View style={{alignSelf:'center'}}><Text style={{fontSize:16, color:'grey'}}>{"version 1.0"}</Text></View> */}
          </View>
        </View>
      </View>
    );
  }

  openStore() {
    const APP_STORE_LINK =
      "itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8";
    const PLAY_STORE_LINK = "market://details?id=com.eatance";

    if (Platform.OS == "ios") {
      Linking.openURL(APP_STORE_LINK).catch((err) => {});
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch((err) => {});
    }
  }

  shareApp() {
    const APP_STORE_LINK =
      "itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8";
    const PLAY_STORE_LINK =
      "https://play.google.com/store/apps/details?id=com.eatance";

    const shareOptions = {
      title: "Share SHOBAIK LOBAIK Application",
      url: Platform.OS == "ios" ? APP_STORE_LINK : PLAY_STORE_LINK,
    };
    Share.open(shareOptions);
  }
}

export const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  modalSubContainer: {
    backgroundColor: "#fff",
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
    color: "#000",
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  deleteOption: {
    fontFamily: ETFonts.bold,
    fontSize: 12,
    color: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    backgroundColor: EDColors.primary,
  },
  navHeader: {
    flex: 1,
    height: metrics.screenHeight * 0.267,
    // flexDirection: "column-reverse",
    backgroundColor: EDColors.primary,
    alignItems: "center",
    // paddingRight: 20,
    // borderWidth:1
  },
});

export default connect(
  (state) => {
    return {
      userData: state.userOperations.userData,
      titleSelected: state.navigationReducer.selectedItem,
      userToken: state.userOperations.phoneNumberInRedux,
      isLogout: state.userOperations.isLogout,
    };
  },
  (dispatch) => {
    return {
      saveNavigationSelection: (dataToSave) => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCredentials: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveLogout: (data) => {
        dispatch(saveLogoutInRedux(data));
      },
    };
  }
)(SideBar);

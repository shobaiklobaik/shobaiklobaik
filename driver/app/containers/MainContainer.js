import React from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  Modal,
  Linking,
  Platform,
  AppState,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import {
  NavigationEvents,
  StackActions,
  NavigationActions,
} from "react-navigation";
import Geocoder from "react-native-geocoding";
import RNRestart from "react-native-restart";
import I18n from "react-native-i18n";
import {
  GOOGLE_API_KEY,
  REGISTRATION_HOME,
  RESPONSE_SUCCESS,
  SEARCH_PLACEHOLDER,
  isRTLCheck,
  getIsRTL,
  GET_ALL_ORDER,
  GET_RESTAURANT_LOCATON,
  LOGIN_URL,
  LOGOUT_API,
  CHANGE_TOKEN,
  DRIVER_TRACKING,
} from "../utils/Constants";
import Assets from "../assets";
import BaseContainer from "./BaseContainer";
import { apiPost, apiGet } from "../api/ServiceManager";
import { EDColors } from "../assets/Colors";
import {
  getUserToken,
  getCartList,
  saveLanguage,
  flushAllData,
} from "../utils/AsyncStorageHelper";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { connect } from "react-redux";
import { saveNavigationSelection } from "../redux/actions/Navigation";
import { netStatus } from "../utils/NetworkStatusConnection";
import { Messages } from "../utils/Messages";
import { ETFonts } from "../assets/FontConstants";
import {
  saveLanguageInRedux,
  saveLogoutInRedux,
  removeUserDetailsOnLogout,
  saveUserDetailsInRedux,
  saveUserTokenInRedux,
} from "../redux/actions/User";
import EDRTLView from "../components/EDRTLView";
import metrics from "../utils/metrics";
import EDText from "../components/EDText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { strings } from "../locales/i18n";
import SegmentComponent from "../components/SegmentComponent";
import { saveOrderDetailsInRedux } from "../redux/actions/Order";
import EDPlaceholderView from "../components/EDPlaceholderView";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
import { isLocationEnable } from "../utils/LocationCheck";
import Geolocation from "react-native-geolocation-service";
import BackgroundTimer from "react-native-background-timer";

var lat = 0.0;
var long = 0.0;

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.userDetails = this.props.userData;
    console.log("this.userDetails", this.userDetails);
    headerPhoneNum = "";
    strSearch = "";
    this.foodType = "";
    this.distance = "";
    this.modelSelected = "";
    this.currentOrderArray = [];
    this.pastOrderArray = [];
    // this.count = 0;
  }

  state = {
    latitude: 0.0,
    longitude: 0.0,
    error: null,
    isLoading: false,
    strAddress: null,
    isNetConnected: true,
    count: 0,
    selectedIndex: 0,
    strOnMessage: "",
    DriverCurrentLatitude: 0.0,
    DriverCurrentLongitude: 0.0,
    timer: null,
    counter: 0,
  };
  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };
  componentWillUnmount() {
    // BackgroundGeolocation.removeAllListeners();
    this.focusListener.remove();
  }
  componentDidUpdate() {}
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      // alert("didFocus");
      // this.didFocusEventHandler();
      // this.requestLocationPermission();
    });
    this.didFocusEventHandler();
  }

  getLatLong = async () => {
    if (Platform.OS === "ios") {
      if (GOOGLE_API_KEY !== "") {
        Geocoder.init(GOOGLE_API_KEY);
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(
              "ios main container background getting FUll LOCATION ::::::::::: ",
              position
            );
            this.driverTracking(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.log("ios DENIED");
            showDialogue(strings("general.locationPermission"), [], "", () => {
              this.isOpenSetting = true;
              Linking.openURL("app-settings:");
            });
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
        );
      } else {
        showDialogue(
          "Google Maps API key is not configured for this application.",
          [],
          ""
        );
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "App Location Permission",
            message: "For a better experiene app access location",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
          if (GOOGLE_API_KEY !== "") {
            Geocoder.init(GOOGLE_API_KEY);
            Geolocation.getCurrentPosition(
              (position) => {
                console.log(
                  "android main container background getting FUll LOCATION ::::::::::: ",
                  position
                );
                this.driverTracking(
                  position.coords.latitude,
                  position.coords.longitude
                );
                // ToastAndroid.show(
                //   `MainCOntainer Screen latitude: ${position.coords.latitude} longitude : ${position.coords.longitude}`,
                //   ToastAndroid.LONG
                // );
              },
              (error) => {
                console.log("android DENIED");
                showDialogue(
                  strings("general.locationPermission"),
                  [],
                  "",
                  () => {
                    this.isOpenSetting = true;
                    Linking.openURL("app-settings:");
                  }
                );
              },
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
            );
          }
        } else {
          console.log("location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  didFocusEventHandler = (payload) => {
    if (Platform.OS === "android") {
      this.requestLocationPermission();
      // isLocationEnable(
      //   (success) => {
      //     if (GOOGLE_API_KEY !== "") {
      //       Geocoder.init(GOOGLE_API_KEY);
      //       Geolocation.getCurrentPosition(
      //         (position) => {
      //           console.log(
      //             "didFocusEventHandler FUll LOCATION ::::::::::: ",
      //             position
      //           );
      //           console.log(
      //             "CURRENT ADDRESSS :::::: ",
      //             position.coords.latitude,
      //             " :::::::::: ",
      //             position.coords.longitude
      //           );
      //           this.driverTracking(
      //             position.coords.latitude,
      //             position.coords.longitude
      //           );
      //           BackgroundTimer.runBackgroundTimer(() => {
      //             this.getLatLong();
      //           }, 120000);
      //         },
      //         (error) => {
      //           console.log("ios DENIED");
      //           showDialogue(
      //             strings("general.locationPermission"),
      //             [],
      //             "",
      //             () => {
      //               this.isOpenSetting = true;
      //               Linking.openURL("app-settings:");
      //             }
      //           );
      //         },
      //         { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      //       );
      //     } else {
      //       showDialogue(
      //         "Google Maps API key is not configured for this application.",
      //         [],
      //         ""
      //       );
      //     }
      //   },
      //   (error) => {
      //     console.log("error", error);
      //     console.log("error", "Please allow location access from setting");
      //   },
      //   (backPress) => {
      //     console.log(backPress);
      //   }
      // );
    } else {
      this.checkLocationIOS();
    }
  };

  checkLocationIOS() {
    if (GOOGLE_API_KEY !== "") {
      Geocoder.init(GOOGLE_API_KEY);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("FUll LOCATION ::::::::::: ", position);
          console.log(
            "CURRENT ADDRESSS :::::: ",
            position.coords.latitude,
            " :::::::::: ",
            position.coords.longitude
          );
          this.driverTracking(
            position.coords.latitude,
            position.coords.longitude
          );
          BackgroundTimer.runBackgroundTimer(
            () => {
              this.getLatLong();
            },
            this.userDetails.location_update
              ? this.userDetails.location_update
              : 25000
          );
        },
        (error) => {
          console.log("ios DENIED");
          showDialogue(strings("general.locationPermission"), [], "", () => {
            this.isOpenSetting = true;
            Linking.openURL("app-settings:");
          });
          this.setState({ isLoading: false });
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          timeout: 1000,
          maximumAge: 0,
        }
      );
    } else {
      showDialogue(
        "Google Maps API key is not configured for this application.",
        [],
        ""
      );
    }
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App Location Permission",
          message: "For a better experiene app access location",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        if (GOOGLE_API_KEY !== "") {
          Geocoder.init(GOOGLE_API_KEY);
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(
                "background getting FUll LOCATION ::::::::::: ",
                position
              );
              this.driverTracking(
                position.coords.latitude,
                position.coords.longitude
              );
              BackgroundTimer.runBackgroundTimer(
                () => {
                  this.getLatLong();
                },
                this.userDetails.location_update
                  ? this.userDetails.location_update
                  : 25000
              );
            },
            (error) => {
              console.log("ios DENIED");
              showDialogue(
                strings("general.locationPermission"),
                [],
                "",
                () => {
                  this.isOpenSetting = true;
                  Linking.openURL("app-settings:");
                }
              );
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
          );
        }
      } else {
        console.log("location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  lanSelectClick = () => {
    let lan = I18n.currentLocale();
    // if (this.state.lanImage == Assets.ar_selected) {
    if (isRTLCheck()) {
      lan = "en";
      I18n.locale = "en";
    } else {
      lan = "ar";
      I18n.locale = "ar";
    }

    this.props.saveLanguageRedux(lan);

    saveLanguage(
      lan,
      (success) => {
        getIsRTL();
        RNRestart.Restart();
      },
      (error) => {}
    );
  };

  changeTokenAPI = () => {
    let params = {
      token: this.userDetails.PhoneNumber,
      user_id: this.userDetails.UserID,
      firebase_token: this.props.token,
    };
    apiPost(
      CHANGE_TOKEN,
      params,
      (success) => {
        console.log("Change Token success ::::::::::: ", success);
      },
      (failure) => {
        console.log("Change Token failure ::::::::::: ", failure);
      }
    );
  };

  driverTracking = (latitude, longitude) => {
    lat = latitude;
    long = longitude;
    this.setState({
      DriverCurrentLatitude: latitude,
      DriverCurrentLongitude: longitude,
    });
    console.log("===============================================", lat, long);
    console.log(
      "===============================================",
      this.state.DriverCurrentLatitude,
      this.state.DriverCurrentLongitude
    );

    let lan = I18n.currentLocale();
    let langu = "";
    if (lan == "ar") {
      langu = "arabic";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    } else {
      langu = "english";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    }
    console.log("Sugan", "language paramsss" + lan);

    let param = {
      // language: langu,
      token: this.userDetails.PhoneNumber,
      user_id: this.userDetails.UserID,
      latitude: latitude,
      longitude: longitude,
    };

    netStatus((status) => {
      if (status) {
        apiPost(
          DRIVER_TRACKING,
          param,
          (onSuccess) => {
            console.log("Location Successfully :::::::: ");
          },
          (onFailure) => {
            console.log("Location Unsuccessfully :::::::: ");
          }
        );
      } else {
        // console.log("error", err)
        showValidationAlert(Messages.internetConnnection);
      }
    });
  };

  fetchHomeData = () => {
    this.setState({
      isLoading: true,
    });
    let lan = I18n.currentLocale();
    let langu = "";
    if (lan == "ar") {
      langu = "arabic";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    } else {
      langu = "english";
      console.log("Sugan", "language langu " + langu);
      this.setState({ language: langu });
    }
    console.log("Sugan", "language paramsss" + lan);

    let param = {
      language: langu,
      token: this.userDetails.PhoneNumber,
      user_id: this.userDetails.UserID,
    };
    netStatus((status) => {
      console.log("status", status);
      if (status) {
        apiPost(
          GET_ALL_ORDER,
          param,
          (onSuccess) => {
            this.currentOrderArray = onSuccess.order_list.current;
            this.pastOrderArray = onSuccess.order_list.past;

            console.log("CURRENT DATA ::::::::::::: ", this.currentOrderArray);
            console.log("PAST DATA :::::::::::: ", this.pastOrderArray);
            this.props.saveOrder(this.pastOrderArray);

            this.currentOrderArray.length !== 0 ||
            this.currentOrderArray.length !== 0
              ? this.setState({
                  isLoading: false,
                })
              : this.setState({
                  strOnMessage: strings("order.noorder"),
                  isLoading: false,
                });
          },
          (onFailure) => {
            console.log("FAILURE :::::::::::: ", onFailure);
            this.setState({
              strOnMessage: strings("order.noorder"),
              isLoading: false,
            });
          }
        );
      } else {
        // console.log("error", err)
        showValidationAlert(Messages.internetConnnection);
      }
    });
  };

  navigateToCurrentOrderContainer = (orderData) => {
    console.log("orderData------------------->", orderData);
    const { DriverCurrentLatitude, DriverCurrentLongitude } = this.state;
    if (
      DriverCurrentLatitude !== "" &&
      DriverCurrentLatitude !== 0.0 &&
      DriverCurrentLatitude !== null
    ) {
      let param = {
        user_id: this.userDetails.UserID,
        order_id: orderData.order_id,
        token: this.userDetails.PhoneNumber,
      };

      console.log("param", param);

      netStatus((status) => {
        console.log("status", status);
        if (status) {
          this.setState({
            isLoading: true,
          });
          apiPost(
            GET_RESTAURANT_LOCATON,
            param,
            (onSuccess) => {
              this.setState({
                isLoading: false,
              });
              console.log("Fetch_Restarant_Location---------->", onSuccess);
              console.log("latlong----------------->", lat, long);
              console.log(
                "Driver Current Location --------->",
                DriverCurrentLatitude,
                DriverCurrentLongitude
              );
              this.props.navigation.navigate("CurrentOrderContainer", {
                currentOrder: orderData,
                fetch_Driver_Location: onSuccess,
                DriverCurrentLatitude: DriverCurrentLatitude,
                DriverCurrentLongitude: DriverCurrentLongitude,
              });
            },
            (onFailure) => {
              console.log("FAILURE :::::::::::: ", onFailure);
              this.setState({
                strOnMessage: strings("order.noorder"),
                isLoading: false,
              });
            }
          );
        } else {
          // console.log("error", err)
          showValidationAlert(Messages.internetConnnection);
        }
      });
    } else {
      // alert(strings("location.title"));
      // this.didFocusEventHandler();
      if (Platform.OS === "android") {
        this.requestLocationPermission();
      } else {
        this.checkLocationIOS();
      }
    }
  };

  navigateToPastOrderContainer = (pastData) => {
    this.props.navigation.navigate("MyEarningContainer");
  };

  _renderItem = ({ item, index }) => {
    console.log("_renderItem---------------->>", item);
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        {/* This is main view */}
        <EDRTLView
          style={{
            backgroundColor: "white",
            marginVertical: 5,
            justifyContent: "space-evenly",
            borderRadius: 2,
            width: metrics.screenWidth * 0.93,
            height: metrics.screenHeight * 0.12,
          }}
        >
          {/* Show image  */}
          <View
            style={{
              justifyContent: "center",
              marginHorizontal: metrics.screenWidth * 0.04,
              marginVertical: metrics.screenHeight * 0.015,
            }}
          >
            <Image
              style={{
                width: metrics.screenWidth * 0.15,
                height: metrics.screenWidth * 0.15,
                borderRadius: 5,
                borderWidth: 1,
              }}
              source={
                item.image !== "" &&
                item.image !== null &&
                item.image !== undefined
                  ? { uri: item.image }
                  : Assets.user_placeholder
              }
              // position="relative"
              // resizeMode="contain"
            />
          </View>

          {/* //Show middle Text */}
          <View
            style={{
              flex: 2,
              flexDirection: "column",
              justifyContent: "space-evenly",
              height: metrics.screenWidth * 0.15,
              alignSelf: "center",
            }}
          >
            <EDText
              style={{
                flex: 1,
                fontFamily: ETFonts.bold,
                fontSize: hp("2.0%"),
              }}
              label={item.name}
            />

            {/* </Text> */}
            <EDText
              style={{
                flex: 1,
                fontFamily: ETFonts.regular,
                fontSize: hp("1.8%"),
                color: "grey",
              }}
              label={"#" + strings("order.orderNumber") + " - " + item.order_id}
            />
            {/* <Text style={{ fontFamily: ETFonts.regular, fontSize: hp("1.8%"), fontWeight: "200", color: "grey", marginTop: 10 }}>
    {item.Order_ID}
  </Text> */}
          </View>

          {/* Show View button */}

          <TouchableOpacity
            style={{
              width: metrics.screenWidth * 0.2,
              height: metrics.screenWidth * 0.07,
              backgroundColor: EDColors.primary,
              borderRadius: 2,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: metrics.screenWidth * 0.04,
            }}
            onPress={() => this.navigateToCurrentOrderContainer(item)}
          >
            <Text
              style={{
                fontFamily: ETFonts.bold,
                fontSize: hp("1.8%"),
                color: "white",
              }}
            >
              {strings("Profile.view")}
            </Text>
          </TouchableOpacity>
        </EDRTLView>
      </View>
    );
  };

  createCurrentView = () => {
    return (
      <FlatList
        // style={{ marginTop: 10}}
        extraData={this.state}
        data={this.currentOrderArray}
        // data={isRTLCheck() ? this.state.selectedIndex == 0 ? this.arrayPastCategories : this.arrayCategories : this.state.selectedIndex == 0 ? this.arrayCategories : this.arrayPastCategories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        // renderItem={this.state.selectedIndex == 0 ? this.createPastView : this.createCurrentView}
        renderItem={this._renderItem}
      />
    );
  };

  createPastView = () => {
    return (
      <FlatList
        // style={{ marginTop: 10}}
        extraData={this.state}
        data={this.pastOrderArray}
        // data={isRTLCheck() ? this.state.selectedIndex == 0 ? this.arrayPastCategories : this.arrayCategories : this.state.selectedIndex == 0 ? this.arrayCategories : this.arrayPastCategories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        // renderItem={this.state.selectedIndex == 0 ? this.createPastView : this.createCurrentView}
        renderItem={({ item, index }) => (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            {/* This is main view */}
            <EDRTLView
              style={{
                backgroundColor: "white",
                marginVertical: 5,
                justifyContent: "space-evenly",
                borderRadius: 2,
                width: metrics.screenWidth * 0.93,
                height: metrics.screenHeight * 0.12,
              }}
            >
              {/* Show image  */}
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: metrics.screenWidth * 0.04,
                  marginVertical: metrics.screenHeight * 0.015,
                }}
              >
                <Image
                  style={{
                    width: metrics.screenWidth * 0.15,
                    height: metrics.screenWidth * 0.15,
                    borderRadius: 5,
                    borderWidth: 1,
                  }}
                  source={{ uri: item.image }}
                  // position="relative"
                  // resizeMode="contain"
                />
              </View>

              {/* //Show middle Text */}
              <View
                style={{
                  flex: 2,
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  height: metrics.screenWidth * 0.15,
                  alignSelf: "center",
                }}
              >
                <EDText
                  style={{
                    flex: 1,
                    fontFamily: ETFonts.bold,
                    fontSize: hp("2.0%"),
                  }}
                  label={item.name}
                />

                {/* </Text> */}
                <EDText
                  style={{
                    flex: 1,
                    fontFamily: ETFonts.regular,
                    fontSize: hp("1.8%"),
                    color: "grey",
                  }}
                  label={
                    "#" + strings("order.orderNumber") + " - " + item.order_id
                  }
                />
                {/* <Text style={{ fontFamily: ETFonts.regular, fontSize: hp("1.8%"), fontWeight: "200", color: "grey", marginTop: 10 }}>
              {item.Order_ID}
            </Text> */}
              </View>

              {/* Show View button */}
              <TouchableOpacity
                style={{
                  width: metrics.screenWidth * 0.2,
                  height: metrics.screenWidth * 0.07,
                  backgroundColor: EDColors.primary,
                  borderRadius: 2,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: metrics.screenWidth * 0.04,
                }}
                onPress={() => this.navigateToPastOrderContainer(item)}
              >
                <Text
                  style={{
                    fontFamily: ETFonts.bold,
                    fontSize: hp("1.8%"),
                    color: "white",
                  }}
                >
                  {strings("Profile.view")}
                </Text>
              </TouchableOpacity>
            </EDRTLView>
          </View>
        )}
      />
    );
  };

  logoutDialog() {
    return (
      <Modal
        visible={this.props.isLogout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ isLogout: false });
        }}
      >
        <View style={style.modalContainer}>
          <View style={style.modalSubContainer}>
            <Text style={style.deleteTitle}>
              {strings("general.logoutConfirm")}
            </Text>

            <View style={style.optionContainer}>
              <Text
                style={style.deleteOption}
                onPress={() => {
                  this.setState({
                    isLoading: true,
                  });
                  let params = {
                    token: this.props.token,
                    user_id: this.userDetails.UserID,
                  };
                  apiPost(
                    LOGOUT_API,
                    params,
                    (onSuccess) => {
                      this.props.saveLogout(false);
                      // this.props.removeDetailFromRedux([]);

                      flushAllData(
                        (response) => {
                          // this.props.saveCartCount(0);
                          this.props.navigation.popToTop();
                          this.props.navigation.dispatch(
                            StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: "LoginContainer",
                                }),
                              ],
                            })
                          );
                          this.setState({
                            isLoading: false,
                          });
                        },
                        (error) => {
                          this.setState({
                            isLoading: false,
                          });
                        }
                      );
                    },
                    (onFailure) => {
                      this.setState({
                        isLoading: false,
                      });
                      showDialogue(strings("general.generalWebServiceError"));
                    }
                  );
                }}
              >
                {strings("dialog.yes")}
              </Text>

              <Text
                style={style.deleteOption}
                onPress={() => {
                  this.props.saveLogout(false);
                }}
              >
                {strings("dialog.no")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <BaseContainer
        title={strings("home.title")}
        left={Assets.menu}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}
        // right={isRTLCheck() ? Assets.ar_selected : Assets.en_selected}
        // onRight={this.lanSelectClick}
        isLoading={this.state.isLoading}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            this.fetchHomeData();
            this.changeTokenAPI();
            this.props.saveNavigationSelection(
              isRTLCheck() ? "HomeRight" : "Home"
            );
          }}
          onDidBlur={(payload) => {
            getIsRTL();
            this.forceUpdate();
            this.fetchHomeData();
          }}
        />

        <SegmentComponent
          // style={{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }}
          arrayList={[strings("home.currentorder"), strings("home.pastorder")]}
          firstView={
            this.currentOrderArray.length !== 0 ? (
              this.createCurrentView()
            ) : (
              <EDPlaceholderView messageToDisplay={this.state.strOnMessage} />
            )
          }
          secondView={
            this.pastOrderArray.length !== 0 ? (
              this.createPastView()
            ) : (
              <EDPlaceholderView messageToDisplay={this.state.strOnMessage} />
            )
          }
        />

        {this.logoutDialog()}
      </BaseContainer>
    );
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
    console.log("state values :::::::::: ", state);
    return {
      userData: state.userOperations.userData,
      isLogout: state.userOperations.isLogout,
      token: state.userOperations.token,
    };
  },
  (dispatch) => {
    return {
      saveNavigationSelection: (dataToSave) => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveLanguageRedux: (language) => {
        dispatch(saveLanguageInRedux(language));
      },
      saveLogout: (data) => {
        dispatch(saveLogoutInRedux(data));
      },
      removeDetailFromRedux: (data) => {
        dispatch(saveUserDetailsInRedux());
      },
      saveOrder: (data) => {
        dispatch(saveOrderDetailsInRedux());
      },
      saveToken: (token) => {
        dispatch(saveUserTokenInRedux(token));
      },
    };
  }
)(MainContainer);

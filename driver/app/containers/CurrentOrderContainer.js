import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Platform,
  NativeModules,
  Alert,
  NativeEventEmitter,
  Dimensions,
  Linking,
  AppState,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import Assets from "../assets";
import { connect } from "react-redux";
import BaseContainer from "./BaseContainer";
import { saveUserDetailsInRedux } from "../redux/actions/User";
import MapView, {
  ProviderPropType,
  Marker,
  Polyline,
  Circle,
  PROVIDER_GOOGLE,
  Callout,
  AnimatedRegion,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import stylesheet from "../stylesheet/stylesheet";
import EDRTLView from "../components/EDRTLView";
import metrics from "../utils/metrics";
import EDText from "../components/EDText";
import EDThemeButton from "../components/EDThemeButton";
import DateComponent from "../components/DeliveryDetailComponent";
import DeliveryDetailComponent from "../components/DeliveryDetailComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "react-native-elements";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";
import { strings } from "../locales/i18n";
import GeneralModel from "../components/GeneralModel";
import { NavigationEvents } from "react-navigation";
import MyCustomCallout from "../components/MyCustomCallout";
import {
  GET_PICKUP_ORDER,
  GET_DELIVERED_ORDER,
  GOOGLE_API_KEY,
  REVIEW_API,
  DRIVER_TRACKING,
  RESPONSE_SUCCESS,
  INR_SIGN,
  isRTLCheck,
  INR_SIGN_AR,
  GET_RESTAURANT_LOCATON,
  GET_ALL_ORDER,
} from "../utils/Constants";
import { apiPost } from "../api/ServiceManager";
import { apiGet } from "../api/APIManager";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { Messages } from "../utils/Messages";
import Moment, { relativeTimeThreshold } from "moment";
import { netStatus } from "../utils/NetworkStatusConnection";
import Geocoder from "react-native-geocoding";
import { isLocationEnable } from "../utils/LocationCheck";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
import I18n from "react-native-i18n";
import Geolocation from "react-native-geolocation-service";
import BackgroundTimer from "react-native-background-timer";

// let { width, height } = Dimensions.get("window");
// const ASPECT_RATIO = width / height;
// const LATITUDE = 23.014785;
// const LONGITUDE = 72.5943723;
// const LATITUDE = 23.0694912;
// const LONGITUDE = 72.531968;
// const LATITUDE = 0.0;
// const LONGITUDE = 0.0;

// const LATITUDE_DELTA = 0.05;
// const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const LOCATION_UPDATE_INTERVAL = 15 * 1000;
// 21.260992, 72.957404 kamrej
// 21.221953, 72.891829 sarthana
// const SourceLocation = { latitude: 21.260992, longitude: 72.957404 };
// const DestinationLocation = { latitude: 21.221953, longitude: 72.891829 };

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 21.260992;
const LONGITUDE = 72.957404;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var SourceLocation = {};
var DestinationLocation = {};
var MarkerDestinationLocation = {};
var initialRegion = {};

// const SourceLocation = { latitude: this.state.curr_latitude, longitude: this.state.curr_longitude };
// const DestinationLocation = { latitude: Driver_Location.res_latitude, longitude: Driver_Location.res_longitude };
// const initialRegion = {
//     latitude: this.state.curr_latitude,
//     longitude: this.state.curr_longitude,
//     latitudeDelta: this.state.latitudeDelta,
//     longitudeDelta: this.state.longitudeDelta,
// }

var MARKERS = [];

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

class CurrentOrderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.sign = isRTLCheck() ? INR_SIGN_AR : INR_SIGN;
    this.currentOrderDict = this.props.navigation.state.params.currentOrder;
    this.fetch_Driver_Location = this.props.navigation.state.params.fetch_Driver_Location;
    this.DriverCurrentLatitude = this.props.navigation.state.params.DriverCurrentLatitude;
    this.DriverCurrentLongitude = this.props.navigation.state.params.DriverCurrentLongitude;
    this.userDetails = this.props.userData;
    console.log("CURRENT ORDER ::::::::: ", this.currentOrderDict);
    console.log(
      "Fetch driver location===============",
      this.fetch_Driver_Location
    );
    console.log(
      "this.DriverCurrentLongitude location===============",
      this.DriverCurrentLongitude
    );
    this.userData = this.props.userData;
    this.watchID = null;
    this.curr_longitude = 0.0;
    this.curr_longitude = 0.0;
    this.res_latitude = 0.0;
    this.res_longitude = 0.0;
    this.dest_latitude = 23.0752311;
    this.dest_longitude = 72.5255534;
    this.coords = {};
    isPickup = false;
    MARKERS = [
      {
        latitude: this.fetch_Driver_Location.user_detail.res_latitude
          ? parseFloat(this.fetch_Driver_Location.user_detail.res_latitude)
          : 0.0,
        longitude: this.fetch_Driver_Location.user_detail.res_longitude
          ? parseFloat(this.fetch_Driver_Location.user_detail.res_longitude)
          : 0.0,
      },
      {
        latitude: this.DriverCurrentLatitude,
        longitude: this.DriverCurrentLongitude,
      },
    ];
    SourceLocation = {
      latitude: this.DriverCurrentLatitude,
      longitude: this.DriverCurrentLongitude,
    };
    DestinationLocation = {
      latitude: this.fetch_Driver_Location.user_detail.res_latitude
        ? this.fetch_Driver_Location.user_detail.res_latitude
        : 0.0,
      longitude: this.fetch_Driver_Location.user_detail.res_longitude
        ? this.fetch_Driver_Location.user_detail.res_longitude
        : 0.0,
    };
    MarkerDestinationLocation = {
      latitude: this.fetch_Driver_Location.user_detail.res_latitude
        ? parseFloat(this.fetch_Driver_Location.user_detail.res_latitude)
        : 0.0,
      longitude: this.fetch_Driver_Location.user_detail.res_longitude
        ? parseFloat(this.fetch_Driver_Location.user_detail.res_longitude)
        : 0.0,
    };
    initialRegion = {
      latitude: this.DriverCurrentLatitude,
      longitude: this.DriverCurrentLongitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }

  state = {
    isLoading: false,
    isModalVisible: false,
    strComment: "",
    isPickup: false,
    key: 1,
    // starRating: 0,
    curr_latitude: this.props.navigation.state.params.DriverCurrentLatitude,
    curr_longitude: this.props.navigation.state.params.DriverCurrentLongitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    language: "",

    res_distance: 0,
    // driver_distance: 0,
    // coords: {},
    appState: AppState.currentState,
    Driver_Location: {},
  };

  componentWillMount() {
    BackgroundGeolocation.removeAllListeners();
  }
  // componentWillUnmount() {
  //   BackgroundGeolocation.removeAllListeners();
  // }

  componentDidMount() {
    this.fitAllMarkers();
    const { user_detail } = this.fetch_Driver_Location;
    this.setState({
      Driver_Location: user_detail,
    });

    if (Platform.OS === "android") {
      setTimeout(() => this.fitAllMarkers(), 2000);
    }
    this.getLatLong();
    BackgroundTimer.runBackgroundTimer(() => {
      console.log("=====BackgroundTimer.runBackgroundTimer=======");
      this.getLatLong();
    }, 20000);

    BackgroundGeolocation.configure(
      {
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        // stationaryRadius: 50,
        distanceFilter: 5,
        notificationTitle: "Background tracking",
        notificationText: "enabled",
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        notificationsEnabled: true,
        locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
        interval: 10000,
        fastestInterval: 2000,
        activitiesInterval: 10000,
        stopOnStillActivity: false,
      },
      (success) => {
        console.log("Configure Success ::::::: ", success);
      },
      (fail) => {
        console.log("Configure fail :::::::");
      }
    );
    // BackgroundTimer.runBackgroundTimer(() => {
    //   //code that will be called every 30 seconds
    //   console.log(
    //     "=====================================call background=================="
    //   );

    BackgroundGeolocation.getCurrentLocation((location) => {
      console.log("inner background CURRENT LOCATION ::::::::: ", location);

      this.setState({
        curr_latitude: location.latitude,
        curr_longitude: location.longitude,
      });
      this.driverTracking(location.latitude, location.longitude);
    });
    // }, 30000);

    BackgroundGeolocation.on("location", (location) => {
      console.log("LOCATION ::::::::: ", location);

      this.driverTracking(location.latitude, location.longitude);
      this.setState({
        curr_latitude: location.latitude,
        curr_longitude: location.longitude,
      });

      // showDialogue(this.curr_latitude,[], this.curr_longitude)
      BackgroundGeolocation.startTask((taskKey) => {
        console.log("TASK ::::::::: ", taskKey);
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("stationary", (stationaryLocation) => {
      // handle stationary locations here
      console.log(
        "stationary ::::::::: ",
        stationaryLocation.latitude + " ---" + stationaryLocation.longitude
      );
      this.driverTracking(
        stationaryLocation.latitude,
        stationaryLocation.longitude
      );
      // showDialogue(stationaryLocation.latitude, [], stationaryLocation.longitude)
      // Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on("error", (error) => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", (status) => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "App requires location tracking permission",
              "Would you like to open app settings?",
              [
                {
                  text: "Yes",
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
              ]
            ),
          1000
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.on("abort_requested", () => {
      console.log("[INFO] Server responded with 285 Updates Not Required");
    });

    BackgroundGeolocation.on("http_authorization", () => {
      console.log("[INFO] App needs to authorize the http requests");
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        "[INFO] BackgroundGeolocation service is running",
        status.isRunning
      );
      console.log(
        "[INFO] BackgroundGeolocation services enabled",
        status.locationServicesEnabled
      );
      console.log(
        "[INFO] BackgroundGeolocation auth status: " + status.authorization
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    if (
      this.currentOrderDict.order_status.toLowerCase() === "preparing" ||
      this.currentOrderDict.order_status.toLowerCase() === "ongoing"
    ) {
      this.dest_latitude = parseFloat(this.currentOrderDict.latitude);
      this.dest_longitude = parseFloat(this.currentOrderDict.longitude);
      this.res_latitude = parseFloat(this.currentOrderDict.res_latitude);
      this.res_longitude = parseFloat(this.currentOrderDict.res_longitude);

      // this.getPolyline();
    }
  }
  getLatLong = async () => {
    if (Platform.OS === "ios") {
      if (GOOGLE_API_KEY !== "") {
        Geocoder.init(GOOGLE_API_KEY);
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(
              "=====background Current Order Screen LatLong=====",
              position
            );
            this.setState({
              curr_latitude: position.coords.latitude,
              curr_longitude: position.coords.longitude,
            });
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
                  "=====background Current Order Screen LatLong=====",
                  position
                );
                this.setState({
                  curr_latitude: position.coords.latitude,
                  curr_longitude: position.coords.longitude,
                });
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

  commentDidChange = (setComment) => {
    this.setstr = setComment;
    this.setState({
      strComment: this.setstr,
    });
  };

  deliveredOrder = () => {
    setTimeout(() => {
      this.props.navigation.navigate("OrderDeliveredContainer", {
        deliveryData: this.currentOrderDict,
      });
    }, 1000);
  };

  pickUpOrderCheck = () => {
    console.log("PICK UP FUNCTION CALL :::::::::::::::::::::: ");
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
      order_id: this.currentOrderDict.order_id,
      driver_map_id: this.currentOrderDict.driver_map_id,
    };

    this.setState({ isLoading: true });
    netStatus((status) => {
      if (status) {
        apiPost(
          GET_PICKUP_ORDER,
          param,
          (onSuccess) => {
            console.log("PICK UP DATA ::::::::::: ", onSuccess);
            if (onSuccess.status == RESPONSE_SUCCESS) {
              this.acceptOrderArray = onSuccess.user_detail;
              // this.destination = {
              (this.dest_latitude = parseFloat(this.acceptOrderArray.latitude)),
                (this.dest_longitude = parseFloat(
                  this.acceptOrderArray.longitude
                ));
              // }

              // this.rest_Location = {
              (this.res_latitude = parseFloat(
                this.acceptOrderArray.res_latitude
              )),
                (this.res_longitude = parseFloat(
                  this.acceptOrderArray.res_longitude
                ));
              // }

              // this.fitAllMarkers();
              // setTimeout(() => this.fitAllMarkers(), 1000);

              // this.distance(this.state.dest_latitude, this.state.dest_longitude, this.state.res_latitude, this.state.res_longitude, "K")

              // this.LocationTimer = setInterval(this.didFocusEventHandler, LOCATION_UPDATE_INTERVAL)
              // this.getLocationUpdates()
              this.fetch_restaurant_Location();
              this.fetchCurrentOrderDetail();

              // this.fitAllMarkers();
              setTimeout(() => this.fitAllMarkers(), 1000);
              this.isPickup = true;
              this.setState({ isLoading: false });
            } else {
              this.setState({ isLoading: false });
              showDialogue(strings("order.pickup"), [], "", () => {
                this.props.navigation.goBack();
              });
            }
          },
          (onFailure) => {
            console.log("PickUp response fail :::::::: ");
            this.setState({ isLoading: false });
            showDialogue(strings("order.pickup"), [], "", () => {
              this.props.navigation.goBack();
            });
          }
        );
      } else {
        // console.log("error", err)
        showValidationAlert(Messages.internetConnnection);
      }
    });
  };

  fetchCurrentOrderDetail = () => {
    this.setState({
      isLoading: true,
    });
    let lan = I18n.currentLocale();
    let langu = "";
    if (lan == "ar") {
      langu = "arabic";
      console.log("Sugan", "language langu " + langu);
      // this.setState({ language: langu });
    } else {
      langu = "english";
      console.log("Sugan", "language langu " + langu);
      // this.setState({ language: langu });
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
            console.log("fetchCurrentOrderDetail :: :: :: :: ", onSuccess);
            var currentOrderArray = onSuccess.order_list.current;
            // this.pastOrderArray = onSuccess.order_list.past;

            console.log("CURRENT DATA ::::::::::::: ", currentOrderArray);
            // console.log("PAST DATA :::::::::::: ", this.pastOrderArray);

            if (currentOrderArray.length !== 0) {
              currentOrderArray.map((item, index) => {
                if (item.order_id === this.currentOrderDict.order_id) {
                  console.log("match item:: :: ", item);
                  // item["sagar"] = "sagar";
                  // item["total_rate"] = "10.00";
                  // item["order_status"] = "preparing";
                  this.currentOrderDict = item;
                }
              });
              this.setState({
                isLoading: false,
              });
              console.log("sagar this.currentOrderDict", this.currentOrderDict);
            } else {
              this.setState({
                isLoading: false,
              });
            }
          },
          (onFailure) => {
            console.log("FAILURE :::::::::::: ", onFailure);
            this.setState({
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
  // getPolyline = () => {
  //   console.log(
  //     "CurrentLocation :::::: ",
  //     this.dest_latitude,
  //     " :::::::::: ",
  //     this.dest_longitude,
  //     " :::::::::: ",
  //     this.res_latitude,
  //     " ::::::::::::: ",
  //     this.res_longitude
  //   );
  //   this.mode = "driving";
  //   this.url = `https://maps.googleapis.com/maps/api/directions/json?origin=${[
  //     this.dest_latitude,
  //     this.dest_longitude
  //   ]}&destination=${[
  //     this.res_latitude,
  //     this.res_longitude
  //   ]}&key=${GOOGLE_API_KEY}&mode=${this.mode}`;

  //   apiGet(
  //     this.url,
  //     onSuccess => {
  //       console.log("LOATIOn SUCCESS ::::::::: ", onSuccess);
  //       var routesArray = onSuccess.routes;

  //       if (onSuccess.routes.length !== 0) {
  //         this.isPickup = true;
  //         this.state.coords = this.decode(
  //           onSuccess.routes[0].overview_polyline.points
  //         );
  //         this.setState({ isLoading: false });
  //       } else {
  //         this.setState({ isLoading: false });
  //       }
  //     },
  //     onFailure => {
  //       console.log("LOATIOn FAILURE ::::::::: ", onFailure);
  //       this.setState({ isLoading: false });
  //     }
  //   );
  // };

  decode = (t, e) => {
    for (
      var n,
        o,
        u = 0,
        l = 0,
        r = 0,
        d = [],
        h = 0,
        i = 0,
        a = null,
        c = Math.pow(10, e || 5);
      u < t.length;

    ) {
      (a = null), (h = 0), (i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (o = 1 & i ? ~(i >> 1) : i >> 1),
        (l += n),
        (r += o),
        d.push([l / c, r / c]);
    }
    return (d = d.map(function (t) {
      return { latitude: t[0], longitude: t[1] };
    }));
  };

  driverTracking = (latitude, longitude) => {
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

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      console.log("KKKKKKKKKKKKKKKKKKKKKKKKKK ::::::::::::::::::::: ", dist);

      // this.state.driver_distance = dist

      this.state.res_distance = Math.ceil(dist);
      return dist;
    }
  };

  reviewAPI = () => {
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
      order_id: this.currentOrderDict.order_id,
      driver_map_id: this.currentOrderDict.driver_map_id,
      order_status: "cancel",
      cancel_reason: this.state.strComment,
    };

    apiPost(
      GET_PICKUP_ORDER,
      param,
      (onSuccess) => {
        // this.removeLocationUpdates()

        // clearInterval(this.LocationTimer)
        this.setState({ isModalVisible: false });
      },
      (onFailure) => {
        this.setState({ isModalVisible: false });
      }
    );
  };

  connectToCall = (calls) => {
    let strLinkToOpen = "tel:" + calls;
    console.log("strLinkToOpen == " + strLinkToOpen);
    Linking.canOpenURL(strLinkToOpen).then((supported) => {
      if (!supported) {
        showDialogue(Messages.callNotAccessible);
      } else {
        return Linking.openURL(strLinkToOpen).catch((err) => {
          showDialogue("SOS CALL ERROR " + err);
        });
      }
    });
  };

  removeLocationUpdates = () => {
    if (this.watchID !== null) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  };

  reviewDialog() {
    return (
      <GeneralModel
        isVisible={this.state.isModalVisible}
        colors={EDColors.primary}
        value={this.state.strComment}
        buttonstyle={{
          backgroundColor:
            this.state.strComment.trim() !== ""
              ? EDColors.primary
              : EDColors.buttonUnreserve,
        }}
        placeholder={strings("general.cancelreview")}
        label={strings("general.reviewcancel")}
        numberOfLines={5}
        multiline={true}
        style={{
          padding: 10,
          height: metrics.screenHeight * 0.145,
          width: metrics.screenWidth * 0.55,
          borderRadius: 2,
          borderColor: EDColors.borderColor,
          borderWidth: 1,
          fontFamily: ETFonts.regular,
          marginTop: metrics.screenHeight * 0.015,
        }}
        onChangeText={this.commentDidChange}
        isNoHide={true}
        YesTitle={strings("signUp.Submit")}
        activeOpacity={this.state.strComment.trim() !== "" ? 0 : 1}
        onYesClick={(data) => {
          if (this.state.strComment.trim() !== "") {
            BackgroundGeolocation.removeAllListeners();
            this.reviewAPI();
            this.props.navigation.goBack();
          } else {
            this.setState({
              isModalVisible: true,
            });
          }
        }}
        onNoClick={(data) => {
          console.log(data);
          this.setState({ isModalVisible: false });
        }}
      />
    );
  }

  _redirectToMap = () => {
    const { Driver_Location } = this.state;
    console.log("Driver_Location", Driver_Location);
    var start = `${this.state.curr_latitude},${this.state.curr_longitude}`;
    const reslatitude = Driver_Location.res_latitude
      ? Driver_Location.res_latitude
      : 0.0;
    const reslongitude = Driver_Location.res_longitude
      ? Driver_Location.res_longitude
      : 0.0;
    console.log("start", start);
    console.log("res lntlong", reslatitude, reslongitude);
    // desti 21.266951, 72.957119   21.227010, 72.896669

    var url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${reslatitude},${reslongitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  fetch_restaurant_Location = () => {
    console.log("userDetails-------------------------->", this.userDetails);
    let param = {
      user_id: this.userDetails.UserID,
      order_id: this.currentOrderDict.order_id,
      token: this.userDetails.PhoneNumber,
    };
    console.log("current order function --------->param------->", param);

    netStatus((status) => {
      this.setState({
        isLoading: true,
      });
      console.log("status", status);
      if (status) {
        apiPost(
          GET_RESTAURANT_LOCATON,
          param,
          (onSuccess) => {
            const { user_detail } = onSuccess;
            console.log("Driver_Location 2", user_detail);

            SourceLocation = {
              latitude: this.DriverCurrentLatitude,
              longitude: this.DriverCurrentLongitude,
            };
            console.log("src", SourceLocation);
            DestinationLocation = {
              latitude: user_detail.res_latitude,
              longitude: user_detail.res_longitude,
            };
            console.log("Dest", DestinationLocation);
            MarkerDestinationLocation = {
              latitude: parseFloat(user_detail.res_latitude),
              longitude: parseFloat(user_detail.res_longitude),
            };
            initialRegion = {
              latitude: this.DriverCurrentLatitude,
              longitude: this.DriverCurrentLongitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };
            console.log("init", initialRegion);

            this.setState({
              Driver_Location: user_detail,
              isLoading: false,
            });
            this.fitAllMarkers();
          },
          (onFailure) => {
            console.log("FAILURE :::::::::::: ", onFailure);
            this.setState({
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

  fitAllMarkers() {
    this.map.fitToCoordinates(MARKERS, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  render() {
    console.log("ISDELIVER ::::::::::::::::: ", this.isPickup);
    // console.log("ORDER DDET ::::::::::::::::: ", this.state.coords)
    console.log("Current location ::::::: ", this.state.curr_latitude);
    console.log("res Location ::::::::::: ", this.res_latitude);
    console.log("dest Location ::::::::::: ", this.dest_latitude);
    const { Driver_Location } = this.state;
    console.log("Driver_Location", Driver_Location);

    // const SourceLocation = { latitude: this.DriverCurrentLatitude, longitude: this.DriverCurrentLongitude };
    // const initialRegion = {
    //     latitude: this.DriverCurrentLatitude,
    //     longitude: this.DriverCurrentLongitude,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    // }

    // const { Driver_Location } = this.state;
    // const SourceLocation = { latitude: this.state.curr_latitude, longitude: this.state.curr_longitude };
    // const DestinationLocation = { latitude: Driver_Location.res_latitude, longitude: Driver_Location.res_longitude };
    // const initialRegion = {
    //     latitude: this.state.curr_latitude,
    //     longitude: this.state.curr_longitude,
    //     latitudeDelta: this.state.latitudeDelta,
    //     longitudeDelta: this.state.longitudeDelta,
    // }

    // const SourceLocation = { latitude: 21.260992, longitude: 72.957404 };
    // const DestinationLocation = { latitude: 21.221953, longitude: 72.891829 };

    // const { user_detail } = this.fetch_Driver_Location;
    // const SourceLocation = { latitude: this.state.curr_latitude, longitude: this.state.curr_longitude };
    // const DestinationLocation = { latitude: user_detail.res_latitude, longitude: user_detail.res_longitude };
    // const initialRegion = {
    //     latitude: 21.260992,
    //     longitude: 72.957404,
    //     latitudeDelta: this.state.latitudeDelta,
    //     longitudeDelta: this.state.longitudeDelta,
    // }

    // SourceLocation = { latitude: this.DriverCurrentLatitude, longitude: this.DriverCurrentLongitude };
    // DestinationLocation = {
    //     latitude: this.fetch_Driver_Location.user_detail.res_latitude,
    //     longitude: this.fetch_Driver_Location.user_detail.res_longitude
    // };
    // initialRegion = {
    //     latitude: this.DriverCurrentLatitude,
    //     longitude: this.DriverCurrentLongitude,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    // }

    console.log("Driver Location=============", SourceLocation);
    console.log("DestinationLocation =============", DestinationLocation);
    console.log(
      "Fetch driver location===============",
      this.fetch_Driver_Location
    );
    console.log("initialRegion =============", initialRegion);

    return (
      <BaseContainer
        title={strings("home.currentorder")}
        left={Assets.backWhite}
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        isLoading={this.state.isLoading}
      >
        <View style={{ flex: 1, backgroundColor: EDColors.white }}>
          {Driver_Location && (
            <MapView
              ref={(ref) => {
                this.map = ref;
              }}
              style={{
                flex: 1,
                width: metrics.screenWidth * 0.916,
                marginVertical: 10,
                alignSelf: "center",
              }}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={false}
              initialRegion={initialRegion}
            >
              <MapViewDirections
                origin={SourceLocation}
                destination={MarkerDestinationLocation}
                apikey={GOOGLE_API_KEY}
                strokeWidth={5}
                strokeColor="#CD1E2B"
              />

              <Marker coordinate={MarkerDestinationLocation} />

              <Marker coordinate={SourceLocation} image={Assets.driver} />
            </MapView>
          )}

          {this.orderViewRender()}
          {this.reviewDialog()}
        </View>
      </BaseContainer>
    );
  }

  orderViewRender() {
    console.log("this.currentOrderDict", this.currentOrderDict);
    return (
      <View style={styles.mainView}>
        <EDRTLView
          style={{
            justifyContent: "space-evenly",
            marginBottom: metrics.screenHeight * 0.015,
          }}
        >
          <EDThemeButton
            label={"GET DIRECTONS"}
            h
            textStyle={{ fontSize: hp("1.8%") }}
            style={{
              width: metrics.screenWidth * 0.4,
              height: metrics.screenHeight * 0.053,
              backgroundColor: EDColors.primary,
            }}
            fontSizeNew={10}
            onPress={() => this._redirectToMap()}
          />
        </EDRTLView>

        <EDRTLView
          style={{
            height: metrics.screenHeight * 0.06,
            backgroundColor: EDColors.backgroundLight,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginHorizontal: metrics.screenWidth * 0.036,
              fontSize: hp("2.5%"),
              fontFamily: ETFonts.bold,
            }}
          >
            {"#" +
              strings("order.orderNumber") +
              " " +
              ":" +
              " " +
              this.currentOrderDict.order_id}
          </Text>
        </EDRTLView>
        <EDRTLView
          style={{
            height: metrics.screenHeight * 0.06,
            backgroundColor: EDColors.backgroundLight,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginHorizontal: metrics.screenWidth * 0.036,
              fontSize: hp("2.5%"),
              fontFamily: ETFonts.bold,
            }}
          >
            {strings("order.Paymentmode") +
              " " +
              ":" +
              " " +
              this.currentOrderDict.payment_mode}
          </Text>
        </EDRTLView>
        <EDRTLView
          style={{
            height: metrics.screenHeight * 0.06,
            backgroundColor: EDColors.backgroundLight,
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Text
            style={{
              marginHorizontal: metrics.screenWidth * 0.036,
              fontSize: hp("2.5%"),
              fontFamily: ETFonts.bold,
            }}
          >
            {strings("order.addressFinal")}
          </Text>
        </EDRTLView>
        <EDRTLView>
          <View
            style={{ flex: 6, marginHorizontal: metrics.screenWidth * 0.06 }}
          >
            {/* <EDText
                            style={{ fontFamily: ETFonts.light, fontSize: hp("2.0%"), marginVertical: metrics.screenHeight * 0.021, textAlign:'right' }}
                            label={"" + this.currentOrderDict.user_name + " " + strings("order.delivery")}
                       />*/}
            <Text
              style={{
                marginHorizontal: metrics.screenWidth * 0.036,
                fontSize: hp("2.0%"),
                fontFamily: ETFonts.light,
                textAlign: "right",
              }}
            >
              {"" +
                this.currentOrderDict.user_name +
                " " +
                strings("order.delivery")}
            </Text>
            <DeliveryDetailComponent
              style={{
                marginBottom: metrics.screenHeight * 0.036,
                textAlign: "right",
              }}
              source={Assets.location_selected}
              label={this.currentOrderDict.address}
            />
            <DeliveryDetailComponent
              style={{ marginBottom: metrics.screenHeight * 0.021 }}
              source={Assets.calender}
              label={
                strings("order.date") +
                " : " +
                Moment(this.currentOrderDict.date).format("DD MMMM YYYY")
              }
            />
            <EDText
              style={{
                flex: 1,
                fontSize: hp("2.0%"),
                fontFamily: ETFonts.bold,
                marginVertical: metrics.screenHeight * 0.0107,
              }}
              label={
                // strings("order.collect") +
                this.currentOrderDict.order_status === "preparing" ||
                this.isPickup
                  ? strings("order.Cashtocollect") +
                    " - " +
                    this.sign +
                    " " +
                    this.currentOrderDict.total_rate
                  : strings("order.Cashtopay") +
                    " - " +
                    this.sign +
                    " " +
                    this.currentOrderDict.total_rate
              }
            />
          </View>
          <View style={{ flex: 2, alignItems: "center" }}>
            <Image
              style={{
                width: metrics.screenWidth * 0.1111,
                height: metrics.screenWidth * 0.1111,
                marginTop: metrics.screenHeight * 0.022,
              }}
              source={
                this.currentOrderDict.user_image === ""
                  ? Assets.name
                  : { uri: this.currentOrderDict.user_image }
              }
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                marginTop: -metrics.screenHeight * 0.025,
                marginLeft: metrics.screenWidth * 0.1,
                zIndex: 1000,
              }}
              onPress={() =>
                this.connectToCall(this.currentOrderDict.phone_number)
              }
            >
              <Image
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
                source={Assets.call_order}
              />
            </TouchableOpacity>
          </View>
        </EDRTLView>

        <View
          style={{
            borderColor: EDColors.borderColor,
            marginVertical: metrics.screenHeight * 0.015,
            borderWidth: 0.9,
          }}
        />
        <EDRTLView
          style={{
            justifyContent: "space-evenly",
            marginBottom: metrics.screenHeight * 0.015,
          }}
        >
          <EDThemeButton
            label={
              // this.currentOrderDict.order_status === "preparing" ||
              this.currentOrderDict.order_status === "preparing" ||
              this.isPickup
                ? strings("order.orderdeliver")
                : strings("order.orderpickup")
            }
            textStyle={{ fontSize: hp("1.8%") }}
            style={{
              width: metrics.screenWidth * 0.4,
              height: metrics.screenHeight * 0.053,
              backgroundColor: EDColors.primary,
            }}
            fontSizeNew={10}
            onPress={() => {
              // alert(this.state.isOrderDeliver)
              if (
                // this.currentOrderDict.order_status === "preparing" ||
                this.currentOrderDict.order_status === "preparing" ||
                this.isPickup
              ) {
                BackgroundGeolocation.removeAllListeners();
                this.deliveredOrder();
              }
              //  if(this.state.isOrderDeliver === true)
              else {
                console.log("test for order pickup-->");
                this.pickUpOrderCheck();
                // this.fetchCurrentOrderDetail();
              }
            }}
            // this.state.isOrderDeliver ? this.isPickup ? this.pickUpOrderCheck : this.deliveredOrder : this.pickUpOrderCheck}
          />
        </EDRTLView>
      </View>
    );
  }
}

CurrentOrderContainer.propTypes = {
  provider: ProviderPropType,
};
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mainView: {
    width: metrics.screenWidth * 0.916,
    marginBottom: metrics.screenWidth * 0.042,
    alignSelf: "center",
    backgroundColor: EDColors.white,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: EDColors.borderColor,
  },
});

export default connect(
  (state) => {
    return {
      userData: state.userOperations.userData,
    };
  },
  (dispatch) => {
    return {
      saveCredentials: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
    };
  }
)(CurrentOrderContainer);

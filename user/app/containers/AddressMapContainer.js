import React from "react";
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
  AppState,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Linking,
  Keyboard
} from "react-native";
import BaseContainer from "./BaseContainer";
import {
  GOOGLE_API_KEY,
  ADD_ADDRESS,
  RESPONSE_SUCCESS
} from "../utils/Constants";
import { getUserToken } from "../utils/AsyncStorageHelper";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import EditText from "../components/EditText";
let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const LONGITUDE_DELTA = 0.0421;
import Geocoder from "react-native-geocoding";
import EDThemeButton from "../components/EDThemeButton";
import { EDColors } from "../assets/Colors";
//import { Messages } from "../utils/Messages";
import { apiPost } from "../api/ServiceManager";
import { netStatus } from "../utils/NetworkStatusConnection";
import { isLocationEnable } from "../utils/LocationCheck";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from "@react-native-community/geolocation";
import { strings } from "../locales/i18n";
import { getLanguage } from "../utils/AsyncStorageHelper";


export default class AddressMapContainer extends React.Component {
  state = {
    language:"",
    isLoading: false,
    strAddress: "",
    addressLine1: "",
    latitude: 0.0,
    longitude: 0.0,
    city: "",
    zipCode: "",
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    item: this.props.navigation.state.params.getDataAll,
    getData: this.props.navigation.state.params.getData,
    isRefresh: false,
    appState: AppState.currentState
  };

  constructor(props) {
    super(props);
       this.title =strings('AddressMapContainer.permission_title');
	  this.message =strings('AddressMapContainer.permission_message');
	  this.showDialogue =strings('AddressMapContainer.showDialogue');
	  this.showDialoguesetting =strings('AddressMapContainer.showDialoguesetting');
	  this.showValidationAlert =strings('AddressMapContainer.showValidationAlert');
	
	
	  this.MloginValidation =strings('Messages.loginValidation');
	  this.MaddressValidation =strings('Messages.addressValidation');
	  this.MgeneralWebServiceError =strings('Messages.generalWebServiceError');
	  this.MinternetConnnection =strings('Messages.internetConnnection');
    this.MselectAddress =strings('Messages.selectAddress');
    this.CheckLanguage();
  }


  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    if (Platform.OS == "android") {
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }
  }

  _handleAppStateChange = nextAppState => {
    console.log("app state", nextAppState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");

      if (this.isOpenSetting == true) {
        console.log("get back result successs");
        this.checkLocationIOS();
      }
    }
    this.setState({ appState: nextAppState });
  };

  updateValue(item) {
    if (
      item != undefined &&
      !(item.addressId === "") &&
      item.addressId != undefined
    ) {
      this.setState({
        strAddress: item.addressLine2,
        addressLine1: item.addressLine1,
        latitude: parseFloat(item.latitude) || 0.0,
        longitude: parseFloat(item.longitude) || 0.0,
        city: item.city,
        zipCode: item.zipCode,
        strAddId: item.addressId,
        region: {
          latitude: parseFloat(item.latitude) || 0.0,
          longitude: parseFloat(item.longitude) || 0.0,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    }
  }
  getAddress(lat, long) {
    this.setState({ isLoading: true });
    Geocoder.from(lat, long)
      .then(json => {

        if (json.results.length !== 0) {
          var city = json.results[0].address_components.filter(
            x =>
              x.types.filter(t => t == "administrative_area_level_1").length > 0
          )

          if (city.length !== 0) {
            city = city[0].long_name;
          } else {
            city = ""
          }

          var pincode = json.results[0].address_components.filter(
            x => x.types.filter(t => t == "postal_code").length > 0
          )

          if (pincode.length !== 0) {
            pincode = pincode[0].short_name;
          } else {
            pincode = ""
          }

          var addressComponent = json.results[0].formatted_address;

          this.setState({
            strAddress: addressComponent,
            city: city,
            zipCode: pincode,
            isLoading: false
          });
        } else {
          this.setState({
            strAddress: "",
            city: "",
            zipCode: "",
            isLoading: false
          });
        }
      })
      .catch(error => {
        console.log("ADDRESSS COMPONENT ERROR ::::::: ", error)
        this.setState({ isLoading: false });
      });
  }

  checkData(data) {
    this.state.getData(data);
    this.props.navigation.goBack();
  }

  async componentWillMount() {
    // if (Platform.OS == "android") {
    //   isLocationEnable(
    //     success => {
    //       console.log("success");
    //       requestLocationPermission(this.props);
    //     },
    //     error => {
    //       console.log("error", error);
    //       showValidationAlert("Please allow location access from setting");
    //     },
    //     backPress => {
    //       console.log(backPress);
    //     }
    //   );
    // } else {
    //   this.checkLocationIOS();
    // }
  }

  checkLocationIOS() {
    Geolocation.getCurrentPosition(
      () => {

        // requestLocationPermission(this.props);

        this.updateValue(this.state.item);
        this.checkUser();
        if (
          this.state.item === undefined ||
          this.state.item.latitude === undefined ||
          this.state.item.latitude === ""
        ) {
          console.log("ios GRANTED :::::::: ", this.state.item, " ::::::::::: ", this.state.item);
          this.getCurrentAddress();
        } else {
        }
      },
      () => {
        console.log("ios DENIED");
        showDialogue(this.showDialoguesetting, [
          {
            text: "ancel"
          }
        ], "",
          () => {
            this.isOpenSetting = true;
            Linking.openURL("app-settings:");
          });
      }
    );
  }

  getCurrentAddress() {
    if (GOOGLE_API_KEY !== "") {

      Geocoder.init(GOOGLE_API_KEY);
      this.setState({ isLoading: true });
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isLoading: true,
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }
          });
          this.getAddress(position.coords.latitude, position.coords.longitude);
          console.log("ADDRESSS Success :::::::: ", position)
        },
        error => {
          console.log("ADDRESSS ERROR :::::::: ", error.message)
          this.setState({ isLoading: false });
          this.setState({ error: error.message });
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      showDialogue(this.showDialogue, [], "")
    }
  }
  checkUser() {
    getUserToken(
      success => {
        userObj = success;
      },
      failure => {
        showValidationAlert(this.MloginValidation);
      }
    );
  }
  CheckLanguage(){
    getLanguage(
      success => {
       if(success.language=="arabic")
       {
        console.log("Sugan","arabic language");
        this.state.language = "arabic";
       }
       else{
        console.log("Sugan","english language");
         this.state.language ="english";
       }
      },failure => {})
  }
  saveAddress() {
    netStatus(status => {
      if (status) {
        if (
          this.state.latitude === 0 ||
          this.state.longitude === 0 ||
          this.state.strAddress.trim() === "" ||
          this.state.addressLine1.trim() === ""
        ) {
          showValidationAlert(this.MaddressValidation);
        } else {
          this.setState({ isLoading: true });
          apiPost(
            ADD_ADDRESS,
            {
              language: this.state.language,
              address: this.state.addressLine1,
              landmark: this.state.strAddress,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              city: this.state.city,
              zipcode: this.state.zipCode,
              user_id: parseInt(userObj.UserID) || 0,
              token: "" + userObj.PhoneNumber,
              address_id:
                this.state.item != undefined &&
                  this.state.item.addressId != undefined
                  ? this.state.item.addressId
                  : ""
            },
            resp => {
              if (resp != undefined) {
                if (resp.status == RESPONSE_SUCCESS) {
                  var sendData = {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    address: this.state.strAddress,
                    city: this.state.city,
                    zipCode: this.state.zipCode
                  };
                  this.checkData(sendData);
                } else {

                  showValidationAlert(resp.message);
                  this.setState({ isLoading: false });
                }
              } else {
                showValidationAlert(this.MgeneralWebServiceError);
                this.setState({ isLoading: false });
              }
            },
            err => {
              this.setState({ isLoading: false });
              showValidationAlert(this.MinternetConnnection);
            }
          );
        }
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  render() {
    this.props.navigation.addListener("didFocus", payload => {
      // isLocationEnable(
      //   success => {
      //     console.log("success");
      //     this.updateValue(this.state.item);
      //     this.checkUser();
      //     if (
      //       this.state.item === undefined ||
      //       this.state.item.latitude === undefined ||
      //       this.state.item.latitude === ""
      //     ) {
      //       this.getCurrentAddress();
      //     } else {
      //     }
      //   },
      //   error => {
      //     console.log("error");
      //     showValidationAlert("Please allow location access from setting");
      //   },
      //   backPress => {
      //     console.log(backPress);
      //   }
      // );

      if (Platform.OS == "android") {
        isLocationEnable(
          success => {
            console.log("success");
            // requestLocationPermission(this.props);

            this.updateValue(this.state.item);
            this.checkUser();
            if (
              this.state.item === undefined ||
              this.state.item.latitude === undefined ||
              this.state.item.latitude === ""
            ) {
              this.getCurrentAddress();
            } else {
            }
          },
          error => {
            console.log("error", error);
            showValidationAlert(this.showValidationAlert);
          },
          backPress => {
            console.log(backPress);
          }
        );
      } else {
        this.checkLocationIOS();
      }
    });

    return (


      <BaseContainer
        title={strings('AddressMapContainer.AddressSelection')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{ flex: 1 }}>
          <View
            style={{
              margin: 10,
              flex: 1
            }}
          >
            <KeyboardAvoidingView
              behavior="padding"
              enabled

              style={{ flex: 1, backgroundColor: "#fff" }}
            >
              <View
                style={{
                  flex: 1,
                  padding: 2,
                  backgroundColor: EDColors.primary,
                  marginTop: 5
                }}
              >
                <MapView
                  provider={Platform.OS == "ios" ? null : PROVIDER_GOOGLE}
                  zoomControlEnabled={true}
                  zoomEnabled={true}
                  showsUserLocation={true}
                  zoom={100}
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",

                  }}
                  region={this.state.region}
                  onRegionChangeComplete={region => this.setState({ region })}
                  onPress={e => {
                    this.setState({
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                      isLoading: true
                      // region: {
                      //   latitude: e.nativeEvent.coordinate.latitude,
                      //   longitude: e.nativeEvent.coordinate.longitude,
                      //   latitudeDelta: LATITUDE_DELTA,
                      //   longitudeDelta: LONGITUDE_DELTA
                      // }
                    });
                    this.getAddress(
                      e.nativeEvent.coordinate.latitude,
                      e.nativeEvent.coordinate.longitude
                    );
                  }}
                >
                  <Marker
                    key={0}
                    coordinate={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude
                    }}
                  />
                </MapView>
              </View>



              <Text style={{}}>{this.MselectAddress}</Text>
              <EditText
                keyboardType="default"
                hint={strings('AddressMapContainer.AddressLine1')}
                maxLength={400}
                value={this.state.addressLine1}
                onChangeText={newText => {
                  this.setState({ addressLine1: newText });
                }}

              />
              <EditText
                keyboardType="default"
                hint={strings('AddressMapContainer.LandMark')}
                multiline={true}
                editable={false}
                maxLength={400}
                value={this.state.strAddress}
                returnKeyType="return"
                onChangeText={newText => {
                  this.setState({ strAddress: newText });
                }}

              />

              <View style={{ margin: 15, alignItems: "center", height: 40 }}>
                <EDThemeButton
                  label={strings('AddressMapContainer.Save')}
                  buttonWidth={140}
                  fontSizeNew={6}
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.saveAddress();
                  }}
                />
              </View>

            </KeyboardAvoidingView>


          </View>
        </View>
      </BaseContainer>
    );
  }
}
export async function requestLocationPermission(prop) {
  if (Platform.OS == "ios") {
    // _checkData(prop);
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
       
        title: this.title,
        message: this.message
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // _checkData(prop);
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}

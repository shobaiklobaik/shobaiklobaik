import React from 'react';
import {
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import {EDColors} from '../assets/Colors';
import Moment, {relativeTimeThreshold} from 'moment';
import {
  RESPONSE_SUCCESS,
  ORDER_LISTING,
  funGetDateStr,
  INR_SIGN,
  capiString,
  GOOGLE_API_KEY,
  DRIVER_TRACKING,
} from '../utils/Constants';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {apiPost} from '../api/ServiceManager';
import ProgressLoader from '../components/ProgressLoader';
import {showValidationAlert, showDialogue} from '../utils/CMAlert';
//import { Messages } from "../utils/Messages";
import {ETFonts} from '../assets/FontConstants';
import OrderStatusCard from '../components/OrderStatusCard';
import PriceDetail from '../components/PriceDetail';
import metrics from '../utils/metrics';
import {connect} from 'react-redux';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
import {netStatus} from '../utils/NetworkStatusConnection';
import {NavigationEvents} from 'react-navigation';
import DeliveryDetailComponent from '../components/DeliveryDetailComponent';
import MyCustomCallout from '../components/MyCustomCallout';
import Geocoder from 'react-native-geocoding';
import MapView, {
  Marker,
  Polyline,
  Circle,
  PROVIDER_GOOGLE,
  Callout,
} from 'react-native-maps';
import {apiGet} from '../api/APIManager';
import EDThemeButton from '../components/EDThemeButton';
import {Thumbnail} from 'native-base';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 23.07946;
const LONGITUDE = 72.506218;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
var timer;
class TrackOrderContainer extends React.Component {
  watchId = null;

  state = {
    language: '',

    isLoading: false,
    // timer: null,
    selectedIndex: 0,
    key: 1,
    isEnable: false,
    isPickup: false,
    curr_latitude: 23.07946,
    curr_longitude: 72.506218,
    dest_latitude: 0.0,
    dest_longitude: 0.0,
    driver_latitude: 0.0,
    driver_longitude: 0.0,
    rest_latitude: 0.0,
    rest_longitude: 0.0,
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    distance: 0,
    coords: {},
  };

  arrayUpcoming = [];

  constructor(props) {
    super(props);
    this.CheckLanguage();

    this.trackOrderDict = this.props.navigation.state.params.trackOrder.data;
    console.log('current Dict ::::::::::::::: ', this.trackOrderDict[0]);
    var userObj = null;

    this.order = strings('TrackOrderContainer.order');
    this.deliver = strings('TrackOrderContainer.deliver');
    this.pay = strings('TrackOrderContainer.pay');
    this.Arriving = strings('TrackOrderContainer.Arriving');
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.McallNotAccessible = strings('Messages.callNotAccessible');
  }

  componentDidMount() {
    (this.state.driver_latitude = parseFloat(
      this.trackOrderDict[0].driver.latitude,
    )),
      (this.state.driver_longitude = parseFloat(
        this.trackOrderDict[0].driver.longitude,
      ));
    (this.state.rest_latitude = parseFloat(this.trackOrderDict[0].resLat)),
      (this.state.rest_longitude = parseFloat(this.trackOrderDict[0].resLong));
    this.state.dest_latitude = parseFloat(this.trackOrderDict[0].user_latitude);
    this.state.dest_longitude = parseFloat(
      this.trackOrderDict[0].user_longitude,
    );

    this.trackArrivalTime(
      this.state.dest_latitude,
      this.state.dest_longitude,
      this.state.rest_latitude,
      this.state.rest_longitude,
    );
    // this.didFocusEventHandler()

    timer = setInterval(this.driverTracking, 10000);
    // this.setState({ timer })
  }

  componentWillUnmount() {
    clearInterval(timer);
    // this.removeLocationUpdates()
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
  driverTracking = () => {
    let param = {
      language: this.state.language,
      token: this.props.token,
      user_id: this.props.userID,
      order_id: this.trackOrderDict[0].order_id,
    };

    apiPost(
      DRIVER_TRACKING,
      param,
      onSuccess => {
        this.driverLatlong = onSuccess.detail;
        // this.state.driver_latitude = this.driverLatlong.driverLatitude,
        //     this.state.driver_longitude = this.driverLatlong.driverLongitude,
        if (
          this.driverLatlong.driverLatitude !== '0' ||
          this.driverLatlong.driverLongitude !== '0'
        ) {
          this.trackArrivalTime(
            this.state.dest_latitude,
            this.state.dest_longitude,
            parseFloat(this.driverLatlong.driverLatitude),
            parseFloat(this.driverLatlong.driverLongitude),
          );
          this.setState({
            driver_latitude: parseFloat(this.driverLatlong.driverLatitude),
            driver_longitude: parseFloat(this.driverLatlong.driverLongitude),
          });
        } else {
          var driver_latitude =
            (this.state.dest_latitude + this.state.rest_latitude) / 2;
          var driver_longitude =
            (this.state.dest_longitude + this.state.rest_longitude) / 2;
          console.log(
            'LAT LONG ::::::: ',
            driver_latitude,
            ' :::::::::: ',
            driver_longitude,
          );
          this.trackArrivalTime(
            this.state.dest_latitude,
            this.state.dest_longitude,
            driver_latitude,
            driver_longitude,
          );
          this.setState({
            driver_latitude: parseFloat(this.driverLatlong.driverLatitude),
            driver_longitude: parseFloat(this.driverLatlong.driverLongitude),
          });
        }
      },
      onFailure => {},
    );
  };

  trackArrivalTime = (
    sourceLat,
    sourcelong,
    destinationLat,
    destinationlong,
  ) => {
    // let arrival = `https://maps.googleapis.com/maps/api/directions/json?origin=${[this.state.rest_latitude, this.state.rest_longitude]}&destination=${[this.state.curr_latitude, this.state.curr_longitude]}&key=${GOOGLE_API_KEY}'
    let arrival = `https://maps.googleapis.com/maps/api/directions/json?origin=${[
      sourceLat,
      sourcelong,
    ]}&destination=${[destinationLat, destinationlong]}&key=${GOOGLE_API_KEY}`;
    apiGet(
      arrival,
      onSuccess => {
        // console.log("Destination Success ::::::: ", onSuccess)
        // console.log("Timeing :::::::::: ", onSuccess.routes[0].legs[0].duration.text)

        // this.state.distance = onSuccess.routes[0].legs[0].duration.text

        var routesArray = onSuccess.routes;
        if (routesArray.length > 0) {
          var legsArray = onSuccess.routes[0].legs;

          if (!this.state.isPickup) {
            if (legsArray.length > 0) {
              this.setState({
                isPickup: true,
                isLoading: false,
                distance: legsArray[0].duration.text,
                coords: this.decode(
                  onSuccess.routes[0].overview_polyline.points,
                ),
              });
              console.log(
                'ARRAY OF LAT LONG :::::::::: ',
                this.decode(onSuccess.routes[0].overview_polyline.points),
              );
            }
          } else {
            if (legsArray.length > 0) {
              onSuccess.routes[0].legs[0].duration.text;
            }
          }
        }
      },
      onFailure => {
        console.log('Destination Failure ::::::: ', onFailure);
      },
    );
  };

  getPolyline = () => {
    this.mode = 'driving';
    this.url = `https://maps.googleapis.com/maps/api/directions/json?origin=${[
      this.state.rest_latitude,
      this.state.rest_longitude,
    ]}&destination=${[
      this.state.curr_latitude,
      this.state.curr_longitude,
    ]}&key=${GOOGLE_API_KEY}&mode=${this.mode}`;

    apiGet(
      this.url,
      onSuccess => {
        console.log('LOATIOn SUCCESS ::::::::: ', onSuccess);
        this.setState(
          {
            isLoading: false,
            //  isPickup: true,
            coords: this.decode(onSuccess.routes[0].overview_polyline.points),
          },
          () => {
            console.log('Draw a Location :::::::: ', this.state.coords);
          },
        );
      },
      onFailure => {
        console.log('LOATIOn FAILURE ::::::::: ', onFailure);
        this.setState({isLoading: false});
      },
    );
  };

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
    return (d = d.map(function(t) {
      return {latitude: t[0], longitude: t[1]};
    }));
  };

  connectToCall = calls => {
    let strLinkToOpen = 'tel:' + calls;
    console.log('strLinkToOpen == ' + strLinkToOpen);
    Linking.canOpenURL(strLinkToOpen).then(supported => {
      if (!supported) {
        showDialogue(this.McallNotAccessible);
      } else {
        return Linking.openURL(strLinkToOpen).catch(err => {
          showDialogue('SOS CALL ERROR ' + err);
        });
      }
    });
  };

  orderViewRender() {
    return (
      <View style={styles.mainView}>
        <View
          style={{
            height: metrics.screenHeight * 0.06,
            backgroundColor: EDColors.backgroundLight,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginHorizontal: metrics.screenWidth * 0.036,
              fontSize: 20,
              fontFamily: ETFonts.bold,
            }}>
            {this.order + this.trackOrderDict[0].order_id}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 6,
              marginHorizontal: metrics.screenWidth * 0.036,
            }}>
            <Text
              style={{
                fontFamily: ETFonts.light,
                fontSize: 15,
                marginVertical: metrics.screenHeight * 0.021,
              }}>
              {'' + this.trackOrderDict[0].driver.first_name + this.deliver}
            </Text>
            {/* <DeliveryDetailComponent
                            style={{ marginBottom: metrics.screenHeight * 0.021 }}
                            source={Assets.location_selected} label={this.currentOrderDict.address} /> */}
            <DeliveryDetailComponent
              style={{marginBottom: metrics.screenHeight * 0.021}}
              source={Assets.time}
              label={
                this.Arriving + this.state.distance
                // + Moment(this.currentOrderDict.date).format(
                //     "hh:mm, DD MMMM YYYY"
                // )
              }
            />
            <Text style={{fontSize: 15, fontFamily: ETFonts.bold}}>
              {this.pay + this.trackOrderDict[0].total}
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <FastImage
              style={{
                width: metrics.screenWidth * 0.1111,
                height: metrics.screenWidth * 0.1111,
                marginTop: metrics.screenHeight * 0.022,
              }}
              source={
                this.trackOrderDict[0].driver.image === ''
                  ? Assets.name
                  : {uri: this.trackOrderDict[0].driver.image}
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
                this.connectToCall(this.trackOrderDict[0].driver.mobile_number)
              }>
              <Image
                style={{width: 40, height: 40}}
                resizeMode="cover"
                source={Assets.call_order}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            borderColor: EDColors.borderColor,
            marginVertical: metrics.screenHeight * 0.015,
            borderWidth: 0.9,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: metrics.screenHeight * 0.015,
          }}>
          <EDThemeButton
            label={strings('TrackOrderContainer.Vieworder')}
            textStyle={{fontSize: 10}}
            style={{
              height: metrics.screenHeight * 0.053,
              //  backgroundColor: this.state.isPickup ? EDColors.buttonUnreserve : EDColors.primary
            }}
            // buttonWidth = {50}
            fontSizeNew={10}
            onPress={() => {
              clearInterval(timer);
              this.props.navigation.navigate('OrderDetailContainer', {
                OrderItem: this.trackOrderDict[0],
              });
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    console.log(
      'LATITUDE :::::::::::::::::::::::::::::::::::: ',
      this.state.curr_latitude,
    );
    console.log(
      'LONGITUDE :::::::::::::::::::::::::::::::::::: ',
      this.state.driver_latitude,
    );
    // console.log("ARRAY OF LATLONG :::::::::::::::::::::::::::::::::::: ", this.state.coords)
    return (
      <BaseContainer
        title={strings('TrackOrderContainer.Trackorder')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        loading={this.state.isLoading}>
        <View style={{flex: 1, backgroundColor: EDColors.white}}>
          <MapView
            // style={styles.map}
            style={{
              flex: 1,
              width: metrics.screenWidth * 0.916,
              marginVertical: 10,
              alignSelf: 'center',
            }}
            // initialRegion={this.state.region}
            region={{
              latitude: this.state.driver_latitude,
              longitude: this.state.driver_longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
            {/* Driver marker */}

            <Marker
              // key={0}
              coordinate={{
                latitude: this.state.dest_latitude,
                longitude: this.state.dest_longitude,
              }}

              // image={Assets.driver}
            />
            {this.state.driver_latitude !== 0 ? (
              <Marker
                // key={0}
                coordinate={{
                  latitude: this.state.driver_latitude,
                  longitude: this.state.driver_longitude,
                }}
                image={Assets.driver}>
                <Callout>
                  <MyCustomCallout
                    title={this.trackOrderDict[0].driver.first_name}
                    discription={this.state.distance}
                    image={{uri: this.trackOrderDict[0].driver.image}}
                  />
                </Callout>
              </Marker>
            ) : null}
            {this.state.rest_latitude !== 0 ? (
              <Polyline
                coordinates={[...this.state.coords]}
                strokeColor={EDColors.primary}
                strokeWidth={2}
                geodesic={true}
              />
            ) : null}

            {this.state.rest_latitude !== 0 ? (
              <Marker
                // key={0}
                coordinate={{
                  latitude: this.state.rest_latitude,
                  longitude: this.state.rest_longitude,
                }}

                // image={Assets.driver}
              />
            ) : null}
          </MapView>
          {this.orderViewRender()}
        </View>
      </BaseContainer>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: metrics.screenWidth * 0.916,

    marginBottom: metrics.screenWidth * 0.042,
    // marginBottom: 20,
    // marginTop: metrics.screenHeight * 0.55,
    alignSelf: 'center',
    // flex:,
    backgroundColor: EDColors.white,
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // shadowOffset: {
    //     height: 0,
    //     width: 0
    // },
    borderWidth: 1,
    borderRadius: 6,
    borderColor: EDColors.borderColor,
  },
});

export default connect(
  state => {
    return {
      titleSelected: state.navigationReducer.selectedItem,
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
)(TrackOrderContainer);

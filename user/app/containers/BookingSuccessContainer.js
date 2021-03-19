import React from 'react';
import {View, Image, BackHandler, StyleSheet, Text} from 'react-native';
import BaseContainer from './BaseContainer';
import EDThemeButton from '../components/EDThemeButton';
import Assets from '../assets';
import {getUserToken} from '../utils/AsyncStorageHelper';
import {ETFonts} from '../assets/FontConstants';
import {strings} from '../locales/i18n';
import FastImage from 'react-native-fast-image';

export default class BookingSuccessContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index,
    });
  };

  componentDidMount() {
    this.checkUser();
  }
  checkUser() {
    getUserToken(
      success => {
        userObj = success;
        this.loadData(success);
      },
      failure => {},
    );
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('MyBooking');
    return true;
  }
  render() {
    return (
      <BaseContainer
        title={strings('BookingSuccessContainer.Confirmation')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.popToTop();
          this.props.navigation.navigate('MyBooking');
        }}>
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
                {strings('BookingSuccessContainer.Thank')}
              </Text>

              <View style={{marginTop: 20}}>
                <EDThemeButton
                  label={strings('BookingSuccessContainer.VIEWBOOKINGS')}
                  onPress={() => {
                    this.props.navigation.popToTop();
                    this.props.navigation.navigate('MyBooking');
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* <View style={{ flex: 1 }}>
          <Image
            source={Assets.confirm_background}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%"
            }}
          />
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
          >
            <View style={{ flex: 7 }} />
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <EDThemeButton
                onPress={() => {
                  this.props.navigation.popToTop();
                  this.props.navigation.navigate("MyBooking");
                }}
                label="View Bookings"
              />
            </View>
          </View>
        </View>
       */}
      </BaseContainer>
    );
  }
}

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

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import BaseContainer from './BaseContainer';
import TextViewLeftImage from '../components/TextViewLeftImage';
import Assets from '../assets';
import {ETFonts} from '../assets/FontConstants';
import MyWebView from 'react-native-webview';
import metrics from '../utils/metrics';
import {strings} from '../locales/i18n';
import FastImage from 'react-native-fast-image';

export default class RecipeDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.detail = this.props.navigation.state.params.detail;
    this.fontSize = Platform.OS == 'ios' ? '18px' : '18px';
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
    // this.customStyle =
    //   "<style>* {max-width: 100%;} body {font-size: 15px;}</style>";
    console.log('Reipe Detail alled--- Sugan ');

    this.customStyle =
      this.meta +
      '<style>* {max-width: 100%;} body {font-size:' +
      this.fontSize +
      ';}</style>';
  }
  render() {
    return (
      <BaseContainer
        title={strings('RecipeDetail.Recipe')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.container}>
            <FastImage
              source={
                this.detail.image != ''
                  ? {uri: this.detail.image}
                  : Assets.header_placeholder
              }
              style={{width: '100%', height: 200}}
            />
            <View style={style.recipeDetail}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor:
                      this.detail.is_veg == '1' ? '#239957' : '#A52A2A',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      margin: 2,
                      borderRadius: 6,
                      backgroundColor:
                        this.detail.is_veg == '1' ? '#239957' : '#A52A2A',
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: '#000',
                    fontFamily: ETFonts.regular,
                    fontSize: 20,
                    marginLeft: 5,
                  }}>
                  {this.detail.name}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  height: 1,
                  backgroundColor: '#000',
                }}
              />

              {this.detail.receipe_time != undefined &&
              this.detail.receipe_time != null ? (
                <TextViewLeftImage
                  image={Assets.time}
                  text={
                    (this.detail.receipe_time != undefined &&
                    this.detail.receipe_time != null
                      ? this.detail.receipe_time
                      : '') + ' Minutes'
                  }
                  lines={0}
                />
              ) : null}
            </View>
          </View>

          <View style={style.subContainer}>
            <MyWebView
              source={{html: this.customStyle + this.detail.receipe_detail}}
              startInLoadingState={true}
              style={style.webview}
              scrollEnabled={true}
            />
          </View>
        </ScrollView>
      </BaseContainer>
    );
  }
}

export const style = StyleSheet.create({
  container: {},
  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    margin: 10,
  },
  recipeDetail: {
    position: 'relative',
    marginTop: -30,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  subContainer: {
    // flex:1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    margin: 10,
    height: metrics.screenHeight * 0.45,
  },
  webview: {
    flex: 1,
    alignSelf: 'flex-start',
    // paddingBottom: Platform.OS == "ios" ? 0 : 15,
    width: '100%',
  },
});

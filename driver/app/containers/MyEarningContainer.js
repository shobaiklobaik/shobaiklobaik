import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  SectionList,
} from "react-native";
import { connect } from "react-redux";
import BaseContainer from "./BaseContainer";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";
import {
  RESPONSE_SUCCESS,
  UPDATE_PROFILE,
  isRTLCheck,
  GET_EARNING_ORDER,
  INR_SIGN,
  INR_SIGN_AR,
} from "../utils/Constants";
import { getUserToken, saveUserLogin } from "../utils/AsyncStorageHelper";
import { apiPostQs, apiPost } from "../api/ServiceManager";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { ETFonts } from "../assets/FontConstants";
import { Messages } from "../utils/Messages";
import ImagePicker from "react-native-image-picker";
import { netStatus } from "../utils/NetworkStatusConnection";
import EDText from "../components/EDText";
import metrics from "../utils/metrics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import EDRTLView from "../components/EDRTLView";
import DeliveryDetailComponent from "../components/DeliveryDetailComponent";
import { strings } from "../locales/i18n";
import EDPlaceholderView from "../components/EDPlaceholderView";
import I18n from "react-native-i18n";
import { Right } from "native-base";

class MyEarningContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sign = isRTLCheck() ? INR_SIGN_AR : INR_SIGN;
    this.userDetails = this.props.userData;
    this.lastOrderArray = [];
    this.previousOrderArray = [];
  }
  state = {
    isLoading: false,
    txtFocus: false,
    isOpen: false,
    selectIndex: "",
    strOnScreenMessage: "",
    language: "",
  };

  componentDidMount() {
    this.myEarningAPI();
  }

  myEarningAPI = () => {
    this.setState({
      isLoading: true,
      strOnScreenMessage: "",
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
      if (status) {
        apiPost(
          GET_EARNING_ORDER,
          param,
          (onSuccess) => {
            this.previousOrderArray = onSuccess.CommissionList.previous;
            this.lastOrderArray = onSuccess.CommissionList.last;

            this.lastOrderArray.length !== 0
              ? this.setState({
                  isLoading: false,
                })
              : this.setState({
                  isLoading: false,
                  strOnScreenMessage: strings("earning.noearning"),
                });
            console.log("EARNING SUCCESS :::::::::", onSuccess);
          },
          (onFailure) => {
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
  earningRenderView = ({ item, index }) => {
    console.log("ITEM :::::::: ", item, " :::::::: ", index);
    return (
      <View>
        <EDRTLView
          style={{
            backgroundColor:
              this.state.isOpen && this.state.selectIndex == index
                ? EDColors.primary
                : EDColors.lightGrey,
            flex: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius:
              this.state.isOpen && this.state.selectIndex == index ? 0 : 5,
            borderBottomRightRadius:
              this.state.isOpen && this.state.selectIndex == index ? 0 : 5,
            marginTop: metrics.screenHeight * 0.021,
          }}
        >
          {/* //Show middle Text */}
          <View
            style={{
              flex: 5,
              flexDirection: "column",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontFamily: ETFonts.regular,
                fontSize: hp("2.0%"),
                color:
                  this.state.isOpen && this.state.selectIndex == index
                    ? EDColors.white
                    : EDColors.black,
              }}
            >
              {strings("order.orderNumber") + " - " + item.order_id}
            </Text>
          </View>

          {/* Show View button */}
          {/* Show image  */}
          <TouchableOpacity
            style={{
              flex: 0.5,
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onPress={() => {
              console.log(
                "SECTION PRESS :::::::::: ",
                item,
                " ::::::::::: ",
                index
              );
              this.state.selectIndex === index
                ? this.setState({ isOpen: !this.state.isOpen })
                : this.setState({
                    isOpen: true,
                    selectIndex: index,
                  });
            }}
          >
            <Image
              style={{ width: 15, height: 15, marginLeft: 5, marginRight: 5 }}
              source={
                this.state.isOpen && this.state.selectIndex == index
                  ? Assets.minus_black
                  : Assets.add_black
              }
              position="relative"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </EDRTLView>

        {this.state.isOpen && this.state.selectIndex === index ? (
          <EDRTLView
            style={{
              padding: metrics.screenHeight * 0.015,
              backgroundColor: EDColors.white,
              // marginBottom: metrics.screenHeight * 0.015,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                marginHorizontal: metrics.screenWidth * 0.04,

                // marginVertical:metrics.screenHeight * 0.015
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: metrics.screenWidth * 0.15,
                  height: metrics.screenWidth * 0.15,
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                // height: metrics.screenWidth * 0.15,
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: hp("2.0%"), fontFamily: ETFonts.regular }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: hp("2.0%"),
                  fontFamily: ETFonts.regular,
                  color: "green",
                }}
              >
                {item.order_status}
              </Text>
              <Text style={{ fontSize: hp("1.8%"), fontFamily: ETFonts.light }}>
                {item.date}
              </Text>
            </View>
            <View
              style={{
                flex: 1.5,
                height: metrics.screenWidth * 0.15,
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ alignSelf: "flex-start" }}>
                {this.sign + " " + item.total_rate}
              </Text>
              {item.commission !== null ? (
                <Text
                  style={{
                    alignSelf: "flex-start",
                    fontSize: hp("1.8%"),
                    fontFamily: ETFonts.light,
                  }}
                >
                  {strings("earning.title") +
                    " - " +
                    this.sign +
                    " " +
                    item.commission}
                </Text>
              ) : null}
            </View>
          </EDRTLView>
        ) : null}
      </View>
    );
  };
  render() {
    return (
      <BaseContainer
        title={strings("earning.title")}
        left={Assets.backWhite}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        isLoading={this.state.isLoading}
      >
        {/* {this.state.isLoading ? <ProgressLoader /> : null} */}

        <View style={{ flex: 1, backgroundColor: EDColors.background }}>
          {this.lastOrderArray.length !== 0 ? (
            <ScrollView style={{ flex: 1, padding: 10 }}>
              {/* //Main View */}
              <View
                style={{
                  padding: metrics.screenHeight * 0.015,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              >
                {/* View for last delivery */}

                <EDText
                  style={{
                    flex: 1,
                    fontSize: hp("2.0%"),
                    fontFamily: ETFonts.bold,
                    fontWeight: "400",
                    // marginTop: 5,
                  }}
                  label={strings("earning.lastdelivery")}
                />

                {/* Line View */}
                <View
                  style={{
                    backgroundColor: EDColors.lightGrey,
                    height: 1,
                    marginVertical: metrics.screenHeight * 0.015,
                  }}
                />

                {/* </View> */}

                {/* Time location Outter View */}
                <EDRTLView style={{ flex: 1, justifyContent: "center" }}>
                  <View
                    style={{
                      backgroundColor: "white",
                      flex: 2.5,
                      // borderWidth: 1,
                      // borderColor: 'green'
                    }}
                  >
                    {/* Time location Inner View */}

                    <DeliveryDetailComponent
                      style={{ marginBottom: metrics.screenHeight * 0.015 }}
                      source={Assets.time}
                      label={this.lastOrderArray[0].time}
                    />

                    <DeliveryDetailComponent
                      source={Assets.location_selected}
                      label={this.lastOrderArray[0].address}
                    />
                  </View>

                  {/* Price View */}
                  <View
                    style={{
                      flex: 2,
                      justifyContent: "space-between",
                      alignItems: isRTLCheck() ? "flex-start" : "flex-end",
                      // borderWidth: 1
                    }}
                  >
                    {/* <EDText
                      style={{
                        fontSize: 16,
                        fontFamily: ETFonts.bold,
                        fontWeight: "600",
                      }}
                      label={
                        this.sign + " " + this.lastOrderArray[0].total_rate
                      }
                    /> */}
                    {/* <EDText
                      style={{
                        fontSize: 16,
                        fontFamily: ETFonts.bold,
                        // fontWeight: "600",
                      }}
                      label={
                        strings("earning.title") +
                        " - " +
                        this.sign +
                        " " +
                        this.lastOrderArray[0].commission
                      }
                    /> */}
                    <Text
                      style={{
                        // alignSelf: "flex-end",
                        textAlign: isRTLCheck() ? "left" : "right",
                        fontSize: hp("1.8%"),
                        fontFamily: ETFonts.bold,
                        // fontFamily: ETFonts.light,
                      }}
                    >
                      {strings("earning.title") +
                        " - " +
                        this.sign +
                        " " +
                        this.lastOrderArray[0].commission}
                    </Text>
                    <Text
                      style={{
                        // alignSelf: "flex-end",
                        textAlign: isRTLCheck() ? "left" : "right",
                        fontSize: hp("1.8%"),
                        fontFamily: ETFonts.bold,
                        // fontFamily: ETFonts.light,
                      }}
                    >
                      {this.sign + " " + this.lastOrderArray[0].total_rate}
                    </Text>
                  </View>
                </EDRTLView>
              </View>
              {/* </View> */}

              <EDText
                style={{
                  flex: 1,
                  marginBottom: metrics.screenHeight * 0.007,
                  marginTop: metrics.screenHeight * 0.03,
                }}
                label={strings("earning.preorder")}
              />

              {/* Flat list view */}

              {/* <SectionList
              // sections={[
              //   { title: 'Title1', data: ['item1', 'item2'] },
              //   { title: 'Title2', data: ['item3', 'item4'] },
              //   { title: 'Title3', data: ['item5', 'item6'] },
              // ]}
              sections={[
                { title: 'ti', data: this.dummyData },
                // { title: 'Title2', data: ['item3', 'item4'] },
                // { title: 'Title3', data: ['item5', 'item6'] },
              ]}
              keyExtractor={(item, index) => item + index}
              renderItem={this.orderDataRender}
              renderSectionHeader={this.sectionViewRender}

            /> */}
              <FlatList
                style={{ marginBottom: 15 }}
                // style={{ marginVertical: metrics.screenHeight * 0.028 }}
                extraData={this.state}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                data={this.previousOrderArray}
                renderItem={this.earningRenderView}
                keyExtractor={(item, index) => item + index}
                initialNumToRender={0}
                initialScrollIndex={0}
              />
            </ScrollView>
          ) : (
            <EDPlaceholderView
              messageToDisplay={this.state.strOnScreenMessage}
            />
          )}
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  (state) => {
    return {
      userData: state.userOperations.userData,
    };
  },
  (dispatch) => {
    return {};
  }
)(MyEarningContainer);

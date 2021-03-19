import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import ProgressLoader from "../components/ProgressLoader";
import BaseContainer from "./BaseContainer";
import { strings } from "../locales/i18n";
import { getLanguage } from "../utils/AsyncStorageHelper";
import { netStatus } from "../utils/NetworkStatusConnection";
import { GET_NOTIFICATION } from "../utils/Constants";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { apiGet, apiPost } from "../api/ServiceManager";
import { Messages } from "../utils/Messages";
import { connect } from "react-redux";
import { saveUserDetailsInRedux } from "../redux/actions/User";
import Assets from "../assets";
import DataNotAvailableContainer from "../components/DataNotAvailableContainer";
import { ETFonts } from "../assets/FontConstants";

class MyNotification extends Component {
  constructor(props) {
    super(props);
    this.userData = this.props.userData;
    this.page_no = 1;
    this.isScrolling = false;
    this.state = {
      isLoading: false,
      notificationList: undefined,
    };
  }

  componentDidMount() {
    this.getNotificationList();
  }

  getNotificationList() {
    const param = {
      user_id: this.userData.UserID,
      token: this.userData.PhoneNumber,
    };

    this.setState({
      isLoading: true,
    });
    netStatus((status) => {
      if (status) {
        apiPost(
          GET_NOTIFICATION,
          param,
          (onSuccess) => {
            if (onSuccess.status == 1) {
              this.setState({
                notificationList: onSuccess.notification,
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
  }
  emptyView() {
    return (
      <View style={style.emptyCartText}>
        <DataNotAvailableContainer />
      </View>
    );
  }
  render() {
    return (
      <BaseContainer
        title={strings("notifiation.title")}
        left={Assets.backWhite}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{ flex: 1 }}>
          {this.state.notificationList != undefined &&
          this.state.notificationList.length > 0 ? (
            <FlatList
              data={this.state.notificationList}
              showsVerticalScrollIndicator={false}
              extraData={this.state}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      width: "95%",
                      marginVertical: 10,
                      // padding: 10,
                      borderRadius: 6,
                      backgroundColor: "white",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignSelf: "center",
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: "30%",
                      }}
                    >
                      <Image
                        style={{
                          alignSelf: "center",
                          width: 100,
                          height: 100,
                          resizeMode: "contain",
                        }}
                        source={Assets.notiicon}
                      />
                    </View>

                    <View
                      style={{
                        width: "70%",
                        justifyContent: "space-between",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: ETFonts.regular,
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {item.notification_title}
                      </Text>

                      <Text
                        style={{
                          color: "#000",
                          fontFamily: ETFonts.regular,
                          fontSize: 14,
                        }}
                      >
                        {item.notification_description}
                      </Text>
                      <Text
                        style={{
                          color: "gray",
                          fontFamily: ETFonts.regular,
                          fontSize: 14,
                        }}
                      >
                        {item.created_date}
                      </Text>
                    </View>
                  </View>
                );
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => item + index}
            />
          ) : this.state.notificationList != undefined &&
            this.state.notificationList.length <= 0 ? (
            this.emptyView()
          ) : null}
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
    return {
      saveUserDetail: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
    };
  }
)(MyNotification);

export const style = StyleSheet.create({
  emptyCartText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    color: '#000',
    fontSize: 15,
    fontFamily: ETFonts.regular,
  },
});

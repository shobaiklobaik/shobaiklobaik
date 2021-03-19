import React from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import BaseContainer from "./BaseContainer";
import { strings } from "../locales/i18n";
//import FlipToggle from "react-native-flip-toggle-button";
import SwitchToggle from "react-native-switch-toggle";
import { saveLanguageInRedux } from "../redux/actions/User";
import { connect } from "react-redux";

import {
  saveLanguages,
  getLanguages,
  saveLanguage,
  getLanguage,
  getUserLogin,
  saveUserFCM,
} from "../utils/AsyncStorageHelper";
import RNRestart from "react-native-restart";
import { netStatus } from "../utils/NetworkStatusConnection";
import { apiPost, apiGet } from "../api/ServiceManager";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import Assets from "../assets";
import I18n from "react-native-i18n";
import {
  isRTLCheck,
  getIsRTL,
  SEND_LANGUAGE_SETTING,
} from "../utils/Constants";
class Language extends React.PureComponent {
  constructor(props) {
    super(props);
    //  console.log("Sugan","switchon="+this.state.switchOn2);
    let lan = I18n.currentLocale();
    console.log("Sugan", "language file I18n lang" + lan);
    this.state = {
      switchOn2: false,
      isLoading: false,
      webViewHeight: 100,
      htmlData: "",
    };
  }

  componentDidMount() {
    //this.getCMSContent();
    //this.CheckLanguage();
    this.checkSelectClick();
  }

  callApiLangSetting = async (language) => {
    await getUserLogin(
      (success) => {
        console.log("getUserLogin success:::::::: ", success);
        const param = {
          token: success.PhoneNumber,
          user_id: success.UserID,
          lang: language,
        };

        //{token:"09876543212",user_id:"93",lang:"ar" }

        console.log("param for callDriverAssignOrder", param);

        netStatus((status) => {
          if (status) {
            apiPost(
              SEND_LANGUAGE_SETTING,
              param,
              (onSuccess) => {
                getIsRTL();
                RNRestart.Restart();
                console.log("success", onSuccess);
              },
              (onFailure) => {
                console.log(
                  "callDriverAssignOrder :: :: :: ::onFailure =========>",
                  onFailure
                );
              }
            );
          } else {
            // console.log("error", err)
            showValidationAlert(Messages.internetConnnection);
          }
        });
      },
      (failure) => {
        console.log("getUserLogin failure:::::::: ", failure);
      }
    );
  };

  lanSelectClick = () => {
    let lan = I18n.currentLocale();
    // if (this.state.lanImage == Assets.ar_selected) {
    console.log("Sugan", "Select Click --- Lan - " + lan);
    console.log("Sugan", "Select Click --- isRTLCheck - " + isRTLCheck());
    this.setState({ switchOn2: !this.state.switchOn2 });
    //  if (isRTLCheck()) {
    if (this.state.switchOn2) {
      lan = "en";
      I18n.locale = "en";
      this.callApiLangSetting(lan);
      console.log("Sugan", "Select Click --- Lan 22- " + lan);
    } else {
      lan = "ar";
      I18n.locale = "ar";
      this.callApiLangSetting(lan);
      console.log("Sugan", "Select Click --- Lan3232 - " + lan);
    }

    // this.props.saveLanguageRedux(lan);

    saveLanguage(
      lan,
      (success) => {
        // getIsRTL();
        // RNRestart.Restart();
      },
      (error) => {}
    );
  };
  checkSelectClick = () => {
    let lan = I18n.currentLocale();
    // if (this.state.lanImage == Assets.ar_selected) {
    console.log("Sugan", "Select Click --- Lan - " + lan);
    console.log("Sugan", "Select Click --- isRTLCheck - " + isRTLCheck());
    // this.setState({ switchOn2: !this.state.switchOn2 });
    if (lan == "ar") {
      this.setState({ switchOn2: true });
      // this.state.switchOn2 = true;
      console.log("Sugan", "arabic true switchon=" + this.state.switchOn2);
    } else {
      this.setState({ switchOn2: false });

      //this.state.switchOn2 =false;
      console.log("Sugan", "arabic false switchon=" + this.state.switchOn2);
    }
  };
  CheckLanguage() {
    getLanguages(
      (success) => {
        if (success.language == "arabic") {
          this.state.switchOn2 = true;
          console.log("Sugan", "arabic true switchon=" + this.state.switchOn2);
        } else {
          this.state.switchOn2 = false;
          console.log("Sugan", "arabic false switchon=" + this.state.switchOn2);
        }
      },
      (failure) => {}
    );
  }
  onPress2 = () => {
    this.setState({ switchOn2: !this.state.switchOn2 });
    if (!this.state.switchOn2) {
      console.log("Sugan", "arabic");
      let obj = {
        language: "arabic",
      };
      saveLanguages(
        obj,
        (success) => {},
        (errAsyncStore) => {}
      );
      RNRestart.Restart();
    } else {
      console.log("Sugan", "english");
      let obj = {
        language: "english",
      };
      saveLanguages(
        obj,
        (success) => {},
        (errAsyncStore) => {}
      );
      RNRestart.Restart();
    }
  };

  render() {
    return (
      <BaseContainer
        title={strings("Language.title")}
        left={Assets.backWhite}
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        loading={this.state.isLoading}
      >
        {/* {this.state.isLoading ? <ProgressLoader /> : null} */}
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        > */}
        {/* <View style={{ flex: 1 }}>
        {this.state.htmlData == "" ? null :
          <MyWebView
            source={{
              html: this.customStyle + this.state.htmlData.description
            }}
            startInLoadingState={true}
            style={{ padding: 20 }}
            scrollEnabled={true}
          />
        }
        </View>*/}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 30 }}>Arabic</Text>
          <SwitchToggle
            containerStyle={{
              marginTop: 16,
              width: 108,
              height: 48,
              borderRadius: 25,
              backgroundColor: "#ccc",
              padding: 5,
            }}
            circleStyle={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "white", // rgb(102,134,205)
            }}
            switchOn={this.state.switchOn2}
            //   switchOn={true}
            //   onToggle={this.lanSelectClick}
            onPress={this.lanSelectClick}
            circleColorOff="white"
            circleColorOn="red"
            duration={500}
          />
        </View>
        {/* </ScrollView> */}
      </BaseContainer>
    );
  }
}
const mapstateToprops = () => {};
// export default connect(
//   state => {
//     console.log("state values :::::::::: ", state)

//   },
//   dispatch => {
//     return {
//       saveLanguageRedux: language => {
//         dispatch(saveLanguageInRedux(language));
//       }
//     };
//   }
// )(Language);

export default Language;

import React from "react";
import { View, Image, StyleSheet, Platform, ScrollView } from "react-native";
import Assets from "../assets";
import BaseContainer from "./BaseContainer";
import { apiPost } from "../api/APIManager";
import {
  CMS_PAGE,
  RESPONSE_SUCCESS,
  ABOUT_US,
  CONTACT_US
} from "../utils/Constants";
import { showDialogue, showValidationAlert } from "../utils/CMAlert";
import ProgressLoader from "../components/ProgressLoader";
//import { Messages } from "../utils/Messages";
import { netStatus } from "../utils/NetworkStatusConnection";
import MyWebView from "react-native-webview";
import metrics from "../utils/metrics";
import { strings } from "../locales/i18n";
import { getLanguage } from "../utils/AsyncStorageHelper";

export default class CMSContainer extends React.PureComponent {
  constructor(props) {
    super(props);
   // console.log("--------------------- CMS Sugan container props routeName", this.props.navigation.state.params.routeName);	 
	  this.MgeneralWebServiceError =strings('Messages.generalWebServiceError');
	  this.MinternetConnnection =strings('Messages.internetConnnection');
    this.aboutus = strings('CMSContainer.AboutUs');
    this.contactus = strings('CMSContainer.ContactUs');
    this.title =
      this.props.navigation.state.params != undefined &&
      this.props.navigation.state.params.routeName != undefined
        && this.props.navigation.state.params.routeName == this.contactus ? this.contactus
        : this.aboutus;

        console.log("Sugan"," Title ---"+ this.title);
        console.log("Sugan","Params value ---"+this.props.navigation.state.params.routeName);
    this.cmsData = {};
    this.CheckLanguage();

console.log("Sugan title ", this.title);

    this.fontSize = Platform.OS == "ios" ? "18px" : "18px";
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
    this.customStyle =
      this.meta +
      "<style>* {max-width: 100%;} body {font-size:" +
      this.fontSize +
      ";}</style>";
  }

  state = {
    language:"",
    isLoading: false
  };

  componentDidMount() {
    this.getCMSContent();
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
       
  getCMSContent() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          CMS_PAGE,
          {
            language: this.state.language,
            cms_id: this.title == this.aboutus ? ABOUT_US : CONTACT_US
          },
          success => {
            if (success.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError
              );
            } else {
              if (success.status == RESPONSE_SUCCESS) {
                this.cmsData = success.cmsData[0];
              } else {
                showValidationAlert(response.message);
              }
            }
            this.setState({ isLoading: false });
          },
          error => {
            this.setState({ isLoading: false });
            showValidationAlert(this.MgeneralWebServiceError, []);
          }
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  render() {
    return (
      <BaseContainer
        title={this.title}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
        {this.state.isLoading ? <ProgressLoader /> : null}
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <Image
              source={Assets.about_us}
              style={{
                flex: 1,
                position: "absolute",
                width: "100%",
                height: "100%"
              }}
            />

            <View
              style={{
                flex: 1,
                width: "100%"
              }}
            >
              <View style={{ flex: 1 }} />
              <View
                style={{
                  flex: 1,
                  margin: 15,
                }}
              >
                {console.log(
                  "This is data",
                  this.cmsData.description != undefined
                    ? this.cmsData.description
                    : "No data"
                )}
                {this.cmsData.description != undefined ? (
                  <MyWebView
                    source={{
                      html: this.customStyle + this.cmsData.description
                    }}
                    width="100%"
                    startInLoadingState={true}
                    style={{
                      flex: 1,
                      marginTop:10,
                      alignSelf: "flex-start",
                      backgroundColor: "transparent"
                    }}
                    //hasIframe={true}
                    scrollEnabled={true}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </BaseContainer>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20
  }
});

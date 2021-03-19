import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import BaseContainer from "./BaseContainer";
import EDThemeButton from "../components/EDThemeButton";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";
import EditText from "../components/EditText";
import {
  RESPONSE_SUCCESS,
  UPDATE_PROFILE,
  isRTLCheck,
} from "../utils/Constants";
import { getUserToken, saveUserLogin } from "../utils/AsyncStorageHelper";
import { apiPostFormData } from "../api/APIManager";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { ETFonts } from "../assets/FontConstants";
import { Messages } from "../utils/Messages";
import ImagePicker from "react-native-image-picker";
import { netStatus } from "../utils/NetworkStatusConnection";
import metrics from "../utils/metrics";
import EDText from "../components/EDText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import EDProfileCart from "../components/EDProfileCart";
import ProfileComponent from "../components/ProfileComponent";
import { strings } from "../locales/i18n";
import { apiPostFileUpload } from "../api/ServiceManager";
import { saveUserDetailsInRedux } from "../redux/actions/User";
import I18n from "react-native-i18n";

class ProfileContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.userData = this.props.userData;

    this.state = {
      isLoading: false,
      shouldPerformValidation: false,
      ImageSource: this.userData.image,
      imageUrl: this.userData.image,
      firstName: this.userData.FirstName,
      lastName: "",
      PhoneNumber: this.userData.PhoneNumber,
      txtFocus: false,
    };
  }

  componentDidMount() {}

  selectPhotoTapped() {
    console.log("openImagePicker Called...");
    ImagePicker.showImagePicker(
      {
        title: strings("general.selectProfilePic"),
        storageOptions: {
          skipBackup: true,
        },
        chooseFromLibraryButtonTitle: strings("general.choosePhotoTitle"),
        takePhotoButtonTitle: strings("general.capturePhotoTitle"),
        cancelButtonTitle: strings("general.cancel"),
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
      },
      (response) => {
        console.log("Response = ", response);

        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          showDialogue(response.error, []);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          console.log("Image source from picker-----<>", response);

          const source = response;
          // this.state.isProfileChange = true;
          this.setState({
            ImageSource: source,
            imageUrl: source.uri,
          });

          //this.setState({ profileImage: source.uri });
        }
      }
    );
  }
  updateData() {
    if (this.validate()) {
      this.updateProfile();
    }
  }

  UpdateProfileValidate = () => {
    this.setState({
      shouldPerformValidation: true,
    });

    if (this.state.firstName.trim() === "") {
      return false;
    }
    this.updateProfile();

    // } else if (this.state.lastName === "") {
    //   showValidationAlert("Please enter last name");
    //   return false;
    // }
    return true;
  };

  updateProfile = () => {
    console.log("PROFILE IMAGE :::::::: ", this.state.ImageSource);
    let lan = I18n.currentLocale();
    console.log("lan :: ::", lan);
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
      token: this.userData.PhoneNumber,
      user_id: this.userData.UserID,
      first_name: this.state.firstName,
      image: this.state.ImageSource,
    };
    console.log("apiPostFileUpload :: ::", param);
    netStatus((status) => {
      if (status) {
        this.setState({ isLoading: true });
        apiPostFileUpload(
          UPDATE_PROFILE,
          param,
          this.state.ImageSource,
          (onSuccess) => {
            this.props.saveUserDetail(onSuccess.profile);
            saveUserLogin(
              onSuccess.profile,
              (success) => {},
              (errAsyncStore) => {}
            );
            this.props.navigation.goBack();
            this.setState({ isLoading: false });
            console.log("Success ::::::::::::: ", onSuccess);
          },
          (onFailure) => {
            this.setState({ isLoading: false });
            console.log("Failure ::::::::::::: ", onFailure);
          }
        );
      } else {
        // console.log("error", err)
        showValidationAlert(Messages.internetConnnection);
      }
    });
  };

  render() {
    return (
      <BaseContainer
        title={strings("Profile.title")}
        left={Assets.backWhite}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
        isLoading={this.state.isLoading}
      >
        <ScrollView style={{ flex: 1, backgroundColor: EDColors.background }}>
          <KeyboardAwareScrollView
            behavior="padding"
            enabled
            contentContainerStyle={{ flex: 1 }}
            style={{ flex: 1, backgroundColor: EDColors.background }}
          >
            {/* {this.state.isLoading ? <ProgressLoader /> : null} */}
            <View style={{ flex: 1, backgroundColor: EDColors.background }}>
              <View
                style={{
                  alignItems: "center",
                  marginBottom: metrics.screenHeight * 0.048,
                }}
              >
                <TouchableOpacity
                  style={{ marginVertical: metrics.screenWidth * 0.055 }}
                  onPress={this.selectPhotoTapped.bind(this)}
                >
                  <Image
                    source={
                      this.state.ImageSource != undefined &&
                      this.state.ImageSource != null &&
                      this.state.ImageSource != ""
                        ? { uri: this.state.imageUrl }
                        : Assets.user_placeholder
                    }
                    style={{
                      borderWidth: 2,
                      borderColor: EDColors.primary,
                      width: metrics.screenWidth * 0.27,
                      // marginTop: metrics.screenHeight * 0.03,
                      height: metrics.screenWidth * 0.27,
                      backgroundColor: "#fff",
                      borderRadius: (metrics.screenWidth * 0.27) / 2,
                    }}
                  />

                  <View
                    style={{
                      backgroundColor: EDColors.primary,
                      width: metrics.screenWidth * 0.06,
                      height: metrics.screenWidth * 0.06,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: (metrics.screenWidth * 0.06) / 2,
                      marginTop: -metrics.screenWidth * 0.08,
                      marginBottom: metrics.screenWidth * 0.02,
                      alignSelf: isRTLCheck() ? "flex-start" : "flex-end",
                      zIndex: 1000,
                    }}
                  >
                    <Image source={Assets.camera_white} />
                  </View>
                </TouchableOpacity>

                <EDText
                  style={{
                    fontSize: hp("2.0%"),
                    fontFamily: ETFonts.regular,
                    fontWeight: "400",
                    marginVertical: metrics.screenWidth * 0.013,
                    // marginTop: 15,
                  }}
                  label={this.userData.FirstName}
                />
                <EDText
                  style={{
                    fontSize: hp("2.0%"),
                    fontFamily: ETFonts.regular,
                    // marginTop: 5,
                    marginVertical: metrics.screenWidth * 0.013,
                    fontWeight: "400",
                  }}
                  label={this.state.PhoneNumber}
                />
              </View>

              <ScrollView>
                <View
                  style={{
                    backgroundColor: EDColors.white,
                    // borderRadius: 5,
                    marginHorizontal: 10,
                  }}
                >
                  <ProfileComponent
                    imagePerson={Assets.name}
                    imageCall={Assets.call}
                    sourceImage={Assets.edit}
                    tintColor={EDColors.primary}
                    value={this.state.firstName}
                    number={this.state.PhoneNumber}
                    onChangeText={(newValue) => {
                      this.setState({ firstName: newValue });
                    }}
                    error={
                      this.state.shouldPerformValidation &&
                      this.state.firstName.trim() === ""
                        ? strings("validationMsg.emptyName")
                        : ""
                    }
                  />
                </View>
                <EDThemeButton
                  label={strings("Profile.save")}
                  isRadius={true}
                  style={{
                    alignSelf: "center",
                    width: metrics.screenWidth * 0.6,
                    height: metrics.screenHeight * 0.076,
                    marginTop: 20,
                  }}
                  onPress={this.UpdateProfileValidate}
                />
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
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
)(ProfileContainer);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
// import { BASE_STACK_NAVIGATOR } from "./app/components/RootNavigator";
import { BASE_STACK_NAVIGATOR } from "./app/components/RootNavigator";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { userOperations } from "./app/redux/reducers/UserReducer";
import { navigationOperation } from "./app/redux/reducers/NavigationReducer";
import { checkoutDetailOperation } from "./app/redux/reducers/CheckoutReducer";
import firebase, {
  Notification,
  NotificationOpen,
} from "react-native-firebase";
import { View, Text } from "react-native";
import { showDialogue } from "./app/utils/CMAlert";
import { createStackNavigator } from "react-navigation";
import { AsyncStorage } from "react-native";
import NavigationService from "./NavigationService";
import {
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  ORDER_TYPE,
  getIsRTL,
  isRTLCheck,
  GET_ASSIGN_ORDER,
} from "./app/utils/Constants";
import I18n from "react-native-i18n";
import { netStatus } from "./app/utils/NetworkStatusConnection";
import { apiPost, apiGet } from "./app/api/ServiceManager";
import {
  getLanguage,
  getUserLogin,
  getLanguages,
} from "./app/utils/AsyncStorageHelper";

const rootReducer = combineReducers({
  userOperations: userOperations,
  navigationReducer: navigationOperation,
  checkoutReducer: checkoutDetailOperation,
});

const eatanceGlobalStore = createStore(rootReducer);
var qwerty = "";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.isNotification = undefined;

    getLanguage(
      (success) => {
        if (success != undefined && success != null) {
          console.log("success lan", success);
          I18n.locale = success.value;
          getIsRTL();
          this.setState({
            isRTLInAppNavigator: isRTLCheck(),
            isLanguage: true,
          });
          // this.props.saveLanguage(success);
        } else {
          console.log("success else lan", success);
          getIsRTL();
          this.setState({
            isRTLInAppNavigator: isRTLCheck(),
            isLanguage: true,
          });
          // this.props.saveLanguage(this.props.lan);
        }
      },
      (error) => {
        console.log("error lan", error);
        getIsRTL();
        // this.props.saveLanguage(this.props.lan);
      }
    );
  }

  state = {
    isRefresh: false,
    isLanguage: undefined,
    isRTLInAppNavigator: false,
    phoneNumber: null,
    userId: null,
    currentOrderNo: null,
  };

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    // alert(enabled)
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    fcmToken = await firebase.messaging().getToken();
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) {
      // alert(error)
      // User has rejected permissions
    }
  }

  componentWillUnmount() {
    try {
      this.notificationListener();
      this.notificationOpenedListener();
    } catch (error) {
      alert(error);
    }
  }

  callDriverAssignOrder = async (order_id) => {
    console.log("callDriverAssignOrder", qwerty);

    await getUserLogin(
      (success) => {
        console.log("getUserLogin success:::::::: ", success);
        const param = {
          user_id: success.UserID,
          order_id: order_id,
          token: success.PhoneNumber,
          lang: "eng",
        };

        console.log("param for callDriverAssignOrder", param);

        netStatus((status) => {
          if (status) {
            apiPost(
              GET_ASSIGN_ORDER,
              param,
              (onSuccess) => {
                console.log("callDriverAssignOrder", onSuccess);
                if (onSuccess.status == 1) {
                  this.state.isRTLInAppNavigator
                    ? NavigationService.navigate("HomeRight")
                    : NavigationService.navigate("Home");
                  console.log("Order accepted successfully");
                }
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
    // await getLanguage(
    //   (success) => {
    //     lang = success.language;
    //     console.log("getLanguage success:::::::: ", success);
    //   },
    //   (failure) => {
    //     console.log("getLanguage failure:::::::: ", failure);
    //   }
    // );

    console.log("****************  ********", user_id, order_id, token, lang);
  };

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body, data } = notification;

        console.log("PAYLOAD NOTIFICATION ::::::::::::: ", notification);
        console.log("DATA NOTIFICATION ::::::::::::: ", data);
        console.log("createNotifi  qwerty cationListeners", qwerty);

        // this.showAlertNew1(body, data);
        console.log("notification listener trigger");

        showDialogue(body, [], "", () => {
          if (data.screenType === "order") {
            this.callDriverAssignOrder(data.order_id);
            console.log("body1", body);
          } else if (data.screenType === "noti") {
            console.log("body2", body);
            this.state.isRTLInAppNavigator
              ? NavigationService.navigate("HomeRight")
              : NavigationService.navigate("Home");
          }
        });
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body, data } = notificationOpen.notification;

        // this.showAlertNew1(body, data);
        console.log("PAYLOAD ::::::::::::: ", notificationOpen);
        console.log("notidata 1", data);

        if (data.screenType === "order") {
          this.callDriverAssignOrder(data.order_id);
          this.state.isRTLInAppNavigator
            ? NavigationService.navigate("HomeRight")
            : NavigationService.navigate("Home");
        } else if (data.screenType === "noti") {
          this.state.isRTLInAppNavigator
            ? NavigationService.navigate("HomeRight")
            : NavigationService.navigate("Home");
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {
        title,
        body,
        data,
        notificationId,
      } = notificationOpen.notification;

      const lastNotification = await AsyncStorage.getItem("lastNotification");

      if (lastNotification !== notificationId) {
        console.log("notidata 2", data);
        if (data.screenType === "order") {
          this.callDriverAssignOrder(data.order_id);

          this.isNotification = ORDER_TYPE;
          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        } else if (data.screenType === "noti") {
          this.isNotification = NOTIFICATION_TYPE;

          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        }
        await AsyncStorage.setItem("lastNotification", notificationId);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
    });

    if (this.isNotification == undefined) {
      this.isNotification = DEFAULT_TYPE;

      this.setState({ isRefresh: this.state.isRefresh ? false : true });
    }
  }

  async componentDidMount() {
    // alert(this.isNotification)
    this.checkPermission();

    // alert(await firebase.messaging().hasPermission())
    // const enabled = await firebase.messaging().hasPermission();
    // // alert(enabled)
    // console.log("ENABLE VALUE ::::::::::: ", enabled)
    // if (enabled) {
    //   this.getToken();
    // } else {
    //   this.requestPermission();
    // }

    this.createNotificationListeners();
  }

  render() {
    return (
      <Provider store={eatanceGlobalStore}>
        {/* {this.isNotification != undefined ? ( */}
        <BASE_STACK_NAVIGATOR
          isRTLFromAppNavigator={this.state.isRTLInAppNavigator}
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          screenProps={this.isNotification}
        />
        {/* ) */}
        {/* : (
          <View>
            <Text>Hiiiiiiii</Text>
          </View>
        )}  */}
      </Provider>
    );
  }
}

export default DEFAULT_NAVIGATOR = createStackNavigator(
  {
    App: {
      screen: App,
    },
  },
  {
    initialRouteName: "App",
    headerMode: "none",
  }
);

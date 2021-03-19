import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from "react-navigation";
import React from "react";
import SplashContainer from "../containers/SplashConainer";
import LoginContainer from "../containers/LoginContainer";
import MainContainer from "../containers/MainContainer";
import SideBar from "./SideBar";
import ProfileContainer from "../containers/ProfileContainer";
import ChangePasswordContainer from "../containers/ChangePasswordContainer";
import InitialContainer from "../containers/InitialContainer";
import ForgotPasswordContainer from "../containers/ForgotPasswordContainer";
import MyEarningContainer from "../containers/MyEarningContainer";
import CurrentOrderContainer from "../containers/CurrentOrderContainer";
import OrderDeliveredContainer from "../containers/OrderDeliveredContainer";
import NotificationContainer from "../containers/notificationContainer";
import Language from "../containers/Language";

export const HOME_SCREEN_DRAWER = createDrawerNavigator(
  {
    Home: {
      screen: MainContainer,
    },
    MyProfile: {
      screen: ProfileContainer,
    },
    MyEarning: {
      screen: MyEarningContainer,
    },
    changePassword: {
      screen: ChangePasswordContainer,
    },
    Language: {
      screen: Language,
    },
    CurrentOrderContainer: {
      screen: CurrentOrderContainer,
    },
    MyEarningContainer: {
      screen: MyEarningContainer,
    },
    OrderDeliveredContainer: {
      screen: OrderDeliveredContainer,
    },
    Notification: {
      screen: NotificationContainer,
    },
  },
  {
    initialRouteName: "Home",
    initialRouteParams: "Home",
    drawerLockMode: "locked-closed",
    drawerPosition: "left",
    backBehavior: "initialRoute",
    contentComponent: (props) => <SideBar {...props} />,
  }
);

export const HOME_SCREEN_DRAWER_RIGHT = createDrawerNavigator(
  {
    HomeRight: {
      screen: MainContainer,
    },
    MyProfile: {
      screen: ProfileContainer,
    },
    MyEarning: {
      screen: MyEarningContainer,
    },
    changePassword: {
      screen: ChangePasswordContainer,
    },
    Language: {
      screen: Language,
    },
    CurrentOrderContainer: {
      screen: CurrentOrderContainer,
    },
    MyEarningContainer: {
      screen: MyEarningContainer,
    },
    OrderDeliveredContainer: {
      screen: OrderDeliveredContainer,
    },
    Notification: {
      screen: NotificationContainer,
    },
  },
  {
    initialRouteName: "HomeRight",
    initialRouteParams: "HomeRight",
    drawerLockMode: "locked-closed",
    drawerPosition: "right",
    backBehavior: "initialRoute",
    contentComponent: (props) => <SideBar {...props} />,
  }
);

export const BASE_STACK_NAVIGATOR = createStackNavigator(
  {
    InitialContainer: {
      screen: InitialContainer,
    },
    SplashContainer: {
      screen: SplashContainer,
    },
    LoginContainer: {
      screen: LoginContainer,
    },
    Home: {
      screen: HOME_SCREEN_DRAWER,
    },
    HomeRight: {
      screen: HOME_SCREEN_DRAWER_RIGHT,
    },
    ForgotPasswordContainer: {
      screen: ForgotPasswordContainer,
    },
  },
  {
    initialRouteName: "SplashContainer",
    headerMode: "none",
  }
);

// class BaseNavigator extends React.Component {
//   render() {

//     return <RootNavigator />;
//   }
// }

// export const AppNavigator = createAppContainer(RootNavigator);

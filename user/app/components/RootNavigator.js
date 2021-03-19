import React from 'react';
import {
  createAppContainer,
  // createDrawerNavigator,
  // createStackNavigator,
} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import SplashContainer from '../containers/SplashConainer';
import LoginContainer from '../containers/LoginContainer';
import SignupContainer from '../containers/SignupContainer';
import MainContainer from '../containers/MainContainer';
import OTPContainer from '../containers/OTPContainer';
import RecipeContainer from '../containers/RecipeContainer';
import SideBar from './SideBar';
import Restaurant from '../containers/Restaurant';
import BookingAvailabilityContainer from '../containers/BookingAvailabilityContainer';
import EventBookContainer from '../containers/EventBookContainer';
import MyBookingContainer from '../containers/MyBookingContainer';
import BookingSuccessContainer from '../containers/BookingSuccessContainer';
import AddressMapContainer from '../containers/AddressMapContainer';
import AddressListContainer from '../containers/AddressListContainer';
import ProfileContainer from '../containers/ProfileContainer';
import ChangePasswordContainer from '../containers/ChangePasswordContainer';
import FilterContainer from '../containers/FilterContainer';
import RestaurantDetail from '../containers/RestaurantDetail';
import CartContainer from '../containers/CartContainer';
import PromoCode from '../containers/PromoCode';
import CMSContainer from '../containers/CMSContainer';
import PrivacyPolicy from '../containers/PrivacyPolicy';
import Language from '../containers/Language';
import PaymentContainer from '../containers/PaymentContainer';
import OrderConfirm from '../containers/OrderConfirm';
import InitialContainer from '../containers/InitialContainer';
import MyOrderContainer from '../containers/MyOrderContainer';
import RecipeDetail from '../containers/RecipeDetail';
import NotificationList from '../containers/NotificationList';
import OrderDetailContainer from '../containers/OrderDetailContainer';
import TrackOrderContainer from '../containers/TrackOrderContainer';
import OnlinepaymentContainer from '../containers/OnlinepaymentContainer';
import OnlinePaymentConfirmationScreen from '../containers/OnlinePaymentConfirmationScreen';

const MAIN_NAVIGATOR = createStackNavigator(
  {
    MainContainer: {
      screen: MainContainer,
    },
    RestaurantContainer: {
      screen: Restaurant,
    },
    ProfileContainer: {
      screen: ProfileContainer,
    },
    ChangePasswordContainer: {
      screen: ChangePasswordContainer,
    },
    CategoryContainer: {
      screen: RestaurantDetail,
    },
    Filter: {
      screen: FilterContainer,
    },
    CartContainer: {
      screen: CartContainer,
    },
    PromoCodeContainer: {
      screen: PromoCode,
    },
    AddressListContainer: {
      screen: AddressListContainer,
    },
    CMSContainer: {
      screen: CMSContainer,
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy,
    },
    Language: {
      screen: Language,
    },
    AddressMapContainer: {
      screen: AddressMapContainer,
    },
    PaymentContainer: {
      screen: PaymentContainer,
    },
    OrderConfirm: {
      screen: OrderConfirm,
    },
    InitialContainer: {
      screen: InitialContainer,
    },
    SplashContainer: {
      screen: SplashContainer,
    },
    LoginContainer: {
      screen: LoginContainer,
    },
  },
  {
    initialRouteName: 'MainContainer',
    headerMode: 'none',
  },
);

const RECIPE_NAVIGATOR = createStackNavigator(
  {
    RecipeContainer: {
      screen: RecipeContainer,
    },
    FilterContainer: {
      screen: Restaurant,
    },
    RecipeDetail: {
      screen: RecipeDetail,
    },
    Filter: {
      screen: FilterContainer,
    },
  },
  {
    initialRouteName: 'RecipeContainer',
    headerMode: 'none',
  },
);

const EVENT_NAVIGATOR = createStackNavigator(
  {
    EventContainer: BookingAvailabilityContainer,
    EventBookContainer: EventBookContainer,
    BookingSuccess: BookingSuccessContainer,
  },
  {
    initialRouteName: 'EventContainer',
    headerMode: 'none',
  },
);

const MY_BOOKING_NAVIGATOR = createStackNavigator(
  {
    MyBookingContainer: MyBookingContainer,
    // InitialContainer: {
    //   screen: InitialContainer
    // },
    // SplashContainer: {
    //   screen: SplashContainer
    // }
  },
  {
    initialRouteName: 'MyBookingContainer',
    headerMode: 'none',
  },
);

const MY_ORDER_NAVIGATOR = createStackNavigator(
  {
    MyOrderContainer: {
      screen: MyOrderContainer,
    },
    TrackOrderContainer: {
      screen: TrackOrderContainer,
    },
    ProfileContainer: {
      screen: ProfileContainer,
    },
    AddressListContainer: {
      screen: AddressListContainer,
    },
    // CMSContainer: {
    //   screen: CMSContainer
    // },
    PrivacyPolicy: {
      screen: PrivacyPolicy,
    },
    Language: {
      screen: Language,
    },
    AddressMapContainer: {
      screen: AddressMapContainer,
    },
    OrderDetailContainer: {
      screen: OrderDetailContainer,
    },
    // InitialContainer: {
    //   screen: InitialContainer
    // },
    // SplashContainer: {
    //   screen: SplashContainer
    // }
  },
  {
    initialRouteName: 'MyOrderContainer',
    headerMode: 'none',
  },
);

const CMS_NAVIGATOR = createStackNavigator(
  {
    CMSContainer: {
      screen: CMSContainer,
    },
    // InitialContainer: {
    //   screen: InitialContainer
    // },
    // SplashContainer: {
    //   screen: SplashContainer
    // }
  },
  {
    initialRouteName: 'CMSContainer',
    headerMode: 'none',
  },
);

const NOTIFICATION_NAVIGATOR = createStackNavigator(
  {
    NotificationContainer: {
      screen: NotificationList,
    },
    // InitialContainer: {
    //   screen: InitialContainer
    // },
    // SplashContainer: {
    //   screen: SplashContainer
    // }
  },
  {
    initialRouteName: 'NotificationContainer',
    headerMode: 'none',
  },
);

export const HOME_SCREEN_DRAWER = createDrawerNavigator(
  {
    Home: {
      screen: MAIN_NAVIGATOR,
    },
    Recipe: {
      screen: RECIPE_NAVIGATOR,
    },
    Event: {
      screen: EVENT_NAVIGATOR,
    },
    MyBooking: {
      screen: MY_BOOKING_NAVIGATOR,
    },
    Notification: {
      screen: NOTIFICATION_NAVIGATOR,
    },
    Order: {
      screen: MY_ORDER_NAVIGATOR,
    },
    // CMSContainer: {
    //   screen: CMSContainer
    // }
  },
  {
    initialRouteName: 'Home',
    initialRouteParams: 'Home',
    drawerLockMode: 'locked-closed',
    // backBehavior: "none",
    contentComponent: props => <SideBar {...props} />,
  },
);

const BASE_STACK_NAVIGATOR = createStackNavigator(
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
    OnlinepaymentContainer: {
      screen: OnlinepaymentContainer,
    },
    OnlinePaymentConfirmationScreen: {
      screen: OnlinePaymentConfirmationScreen,
    },
    SignupContainer: {
      screen: SignupContainer,
    },
    MainContainer: {
      screen: HOME_SCREEN_DRAWER,
    },
    OTPContainer: {
      screen: OTPContainer,
    },
    MY_ORDER_NAVIGATOR: {
      screen: MyOrderContainer,
    },
  },
  {
    initialRouteName: 'InitialContainer',
    headerMode: 'none',
  },
);

export default createAppContainer(BASE_STACK_NAVIGATOR);

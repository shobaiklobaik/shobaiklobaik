import Moment from "moment";

import ReactNative, { NativeModules } from "react-native";
import I18n from "react-native-i18n";

export const locale = NativeModules.I18nManager.localeIdentifier;

// API URL CONSTANTS

// export const BASE_URL = "http://27.54.170.187/~restaura/v1/api/";
// export const BASE_URL = "http://192.168.1.146/fooddeli/v1/driver_api/";
// export const BASE_URL = "http://eatancedelivery.evincedev.com/v1/driver_api/";
// export const BASE_URL = "https://www.seoservicesglobal.com/app/v1/driver_api";

// export const BASE_URL = "http://15.185.81.133/backoffice/v1/driver_api/";

//export const BASE_URL = "http://15.185.81.133/v1/driver_api/";
export const BASE_URL = "http://www.shobaiklobaik.com/demo/v1/driver_api/";
export const BASE_URL_CUSTOMER_APP =
  "http://www.shobaiklobaik.com/demo/v1/api/";
export const REGISTRATION_URL = BASE_URL + "registration";
export const LOGIN_URL = BASE_URL + "login";
export const COUNTRY_CODE_URL = BASE_URL + "getCountryPhoneCode";
export const GET_ALL_ORDER = BASE_URL + "getallOrder";

export const GET_RESTAURANT_LOCATON = BASE_URL + "restaurantLocation";

export const GET_ASSIGN_ORDER = BASE_URL + "assignOrder";
export const SEND_LANGUAGE_SETTING = BASE_URL + "languageSettings";
export const GET_PICKUP_ORDER = BASE_URL + "acceptOrder";
export const DRIVER_TRACKING = BASE_URL + "driverTracking";
export const CHANGE_TOKEN = BASE_URL + "changeToken";
export const GET_DELIVERED_ORDER = BASE_URL + "deliveredOrder";
export const GET_EARNING_ORDER = BASE_URL + "getCommissionList";
export const REVIEW_API = BASE_URL + "addReview";
export const LOGOUT_API = BASE_URL + "logout";

export const GET_RESTAURANT_DETAIL = BASE_URL + "getRestaurantDetail";
export const ADD_TO_CART = BASE_URL + "addtoCart";
export const GET_NOTIFICATION = BASE_URL_CUSTOMER_APP + "getNotification";
export const ADD_REVIEW = BASE_URL + "addReview";
export const ADD_ORDER = BASE_URL + "addOrder";
export const CMS_PAGE = BASE_URL + "getCMSPage";
export const PROMO_CODE_LIST = BASE_URL + "couponList";
export const APPLY_PROMO_CODE = BASE_URL + "checkPromocode";
export const GET_RECIPE_LIST = BASE_URL + "getReceipe";
export const REGISTRATION_HOME = BASE_URL + "getHome";
export const CHECK_BOOKING_AVAIL = BASE_URL + "bookingAvailable";
export const BOOKING_EVENT = BASE_URL + "bookEvent";
export const BOOKING_HISTORY = BASE_URL + "getBooking";
export const DELETE_EVENT = BASE_URL + "deleteBooking";
export const ADD_ADDRESS = BASE_URL + "addAddress";
export const GET_ADDRESS = BASE_URL + "getAddress";
export const DELETE_ADDRESS = BASE_URL + "deleteAddress";
export const UPDATE_PROFILE = BASE_URL + "editProfile";
export const RESET_PASSWORD_REQ_URL = BASE_URL + "changePassword";
export const ORDER_LISTING = BASE_URL + "orderDetail";
export const FORGOT_PASSWORD = BASE_URL + "forgotpassword";
export const VERIFY_OTP = BASE_URL + "verifyOTP";
// export const INR_SIGN = "\u20B9";
export const INR_SIGN = "JOD";
export const INR_SIGN_AR = "د.أ";
// ALERT CONSTANTS
export const RESERVE_STATIC = "/reserve";
export const DOCUMENTS_STATIC = "/documents";
export const APP_NAME = "Eatance";
export const DEFAULT_ALERT_TITLE = APP_NAME;
export const AlertButtons = {
  ok: "OK",
  cancel: "Cancel",
  notNow: "Not now",
  yes: "Yes",
  no: "No",
};

// REQUESTS CONSTANTS
export const RequestKeys = {
  contentType: "Content-Type",
  json: "application/json",
  authorization: "Authorization",
  bearer: "Bearer",
};

// LOAN TYPES CONSTANTS
export const LoanTypes = {
  available: "available",
  reserved: "reserved",
  closed: "closed",
};

// STORAGE CONSTANTS
export const StorageKeys = {
  user_details: "UserDetails",
  lan: "local",
};

// REDUX CONSTANTS
export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const RESPONSE_FAIL = 0;
export const RESPONSE_SUCCESS = 1;
export const COUPON_ERROR = 2;
export const GOOGLE_API_KEY = "AIzaSyD6UTxKQ6wBUAYW4cD3OPAN7r0X_gV64Mk";

//NOTIFICATION_TYPE
export const ORDER_TYPE = "orderNotification";
export const NOTIFICATION_TYPE = "notification";
export const DEFAULT_TYPE = "default";

export const TextFieldTypes = {
  email: "email",
  password: "password",
  phone: "phone",
  datePicker: "datePicker",
  default: "default",
  action: "action",
  picker: "picker",
  amount: "amount",
  otp: "OTP",

  // name: "name",
  // accountNumber:"accountNumber",
};

//MESSAGES
export const CART_PENDING_ITEMS =
  "You have pending items in cart from another restaurant";
export const SEARCH_PLACEHOLDER = "Search for restaurant, cuisine or dish";

//CMS PAGE
export const ABOUT_US = 1;
export const CONTACT_US = 2;
export const PRIVACY_POLICY = 3;

export const funGetTime = (date) => {
  var d = new Date(date);
  return Moment(d).format("LT");
};

export const checkNull = (data) => {
  if (data != undefined && data != "") {
    return data;
  } else {
    return;
  }
};

export const funGetDate = (date) => {
  var d = new Date(date);
  return Moment(d).format("DD-MM-YYYY");
};

export const funGetTomorrowDate = () => {
  var d = new Date();
  var newDate = Moment(d).add(1, "day");

  return new Date(newDate);
};

export function funGetDateStr(date, formats) {
  if (formats == undefined) {
    formats = "DD-MM-YYYY";
  }
  Moment.locale("en");

  var d = new Date("" + date.replaceAll("-", "/"));

  return Moment(d).format(formats);
}

export function funGetTimeStr(date) {
  Moment.locale("en");

  var d = new Date("" + date.replaceAll("-", "/"));

  return Moment(d).format("LT");
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export function removeChars(str) {
  var target = "";

  var strArray = str.split(",");
  const rowLen = strArray.length;
  try {
    if (strArray != undefined)
      strArray.map((data, i) => {
        if (data.trim() === "" || data.trim() === undefined) {
        } else {
          if (rowLen === i + 1) {
            target = target + data;
          } else {
            target = target + data + ",";
          }
        }
      });
  } catch (e) {}
  return target;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capiString(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export function getIsRTL() {
  boolToReturn = I18n.currentLocale().indexOf("ar") === 0;
  ReactNative.I18nManager.allowRTL(false);

  return boolToReturn;
}

export function isRTLCheck() {
  return I18n.currentLocale().indexOf("ar") === 0;
}

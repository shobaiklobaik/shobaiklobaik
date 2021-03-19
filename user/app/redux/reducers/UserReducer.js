import { TYPE_SAVE_LOGIN_DETAILS, TYPE_SAVE_LOGIN_FCM, TYPE_SAVE_COUNTRY_CODE } from "../actions/User";

const initialStateUser = {
  // LOGIN DETAILS
  phoneNumberInRedux: undefined,
  userIdInRedux: undefined
};

export function userOperations(state = initialStateUser, action) {
  switch (action.type) {
    case TYPE_SAVE_LOGIN_DETAILS: {
      return Object.assign({}, state, {
        phoneNumberInRedux: action.value.PhoneNumber,
        userIdInRedux: action.value.UserID
      });
    }
    case TYPE_SAVE_LOGIN_FCM: {
      return Object.assign({}, state, {
        token: action.value
      });
    }
    case TYPE_SAVE_COUNTRY_CODE: {
      return Object.assign({}, state, {
        code: action.value
      });
    }
    // case SAVE_CART_COUNT: {
    //   return Object.assign({}, state, {
    //     cartCount: action.value
    //   });
    // }
    default:
      return state;
  }
}

import { TYPE_SAVE_LOGIN_DETAILS,
TYPE_SAVE_LANGUAGE,TYPE_SAVE_LOGOUT, TYPE_REMOVE_LOGIN_DETAILS, TYPE_SAVE_LOGIN_FCM, TYPE_SAVE_COUNTRY_CODE } from "../actions/User";

const initialStateUser = {
  // LOGIN DETAILS
  lan: "ar",
  isLogout: false,
  phoneNumber: undefined,
  userId: undefined,
  name:undefined
};

export function userOperations(state = initialStateUser, action) {
  switch (action.type) {
    case TYPE_SAVE_LOGIN_DETAILS: {
      return Object.assign({}, state, {
        userData: action.value
      });
    }
    case TYPE_SAVE_LANGUAGE: {
      return Object.assign({}, state, {
        lan: action.value
      });
    }
    case TYPE_SAVE_LOGOUT: {
      return Object.assign({}, state, {
        isLogout: action.value
      });
    }
    case TYPE_REMOVE_LOGIN_DETAILS: {
      return Object.assign({}, state, {
        userData: undefined
      })
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

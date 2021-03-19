
export const TYPE_SAVE_LOGIN_DETAILS = "TYPE_SAVE_LOGIN_DETAILS"
export function saveUserDetailsInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_DETAILS,
        value: details
    }
}

export const TYPE_SAVE_LOGIN_FCM = "TYPE_SAVE_LOGIN_FCM"
export function saveUserFCMInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_FCM,
        value: details
    }
}

export const TYPE_SAVE_LANGUAGE = "TYPE_SAVE_LANGUAGE";
export function saveLanguageInRedux(data) {
    return {
        type: TYPE_SAVE_LANGUAGE,
        value: data
    };
}

export const TYPE_SAVE_LOGOUT = "TYPE_SAVE_LOGOUT";
export function saveLogoutInRedux(data) {
    return {
        type: TYPE_SAVE_LOGOUT,
        value: data
    };
}

export const TYPE_REMOVE_LOGIN_DETAILS = "TYPE_REMOVE_LOGIN_DETAILS"
export function removeUserDetailsOnLogout() {
  return {
    type: TYPE_REMOVE_LOGIN_DETAILS
  }
}

export const TYPE_SAVE_COUNTRY_CODE = "TYPE_SAVE_COUNTRY_CODE"
export function saveCountryCodeInRedux(details) {
    return {
        type: TYPE_SAVE_COUNTRY_CODE,
        value: details
    }
}


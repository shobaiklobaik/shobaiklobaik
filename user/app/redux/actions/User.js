
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

export const TYPE_SAVE_COUNTRY_CODE = "TYPE_SAVE_COUNTRY_CODE"
export function saveCountryCodeInRedux(details) {
    return {
        type: TYPE_SAVE_COUNTRY_CODE,
        value: details
    }
}

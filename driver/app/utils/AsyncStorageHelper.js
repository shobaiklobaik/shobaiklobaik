import { AsyncStorage } from "react-native";
import { StorageKeys } from "./Constants";

export function flushAllData(onSuccess, onFailure) {
  AsyncStorage.clear().then(
    (success) => onSuccess(success),
    (err) => onFailure(err)
  );
}

export function saveUserLogin(details, onSuccess, onFailure) {
  AsyncStorage.setItem("login", JSON.stringify(details)).then(
    (success) => onSuccess(success),
    (err) => onFailure(err)
  );
}

export function saveUserFCM(details, onSuccess, onFailure) {
  AsyncStorage.setItem("token", JSON.stringify(details)).then(
    (success) => onSuccess(success),
    (err) => onFailure(err)
  );
}

export function getUserFCM(onSuccess, onFailure) {
  AsyncStorage.getItem("token").then(
    (res) => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Token Null");
      }
    },
    (err) => onFailure(err)
  );
}

export function getUserLoginDetails(onSuccess, onFailure) {
  AsyncStorage.getItem(StorageKeys.userDetails).then(
    (res) => {
      console.log("Response", res);
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Token Null");
      }
    },
    (err) => onFailure(err)
  );
}

export function getUserLogin(onSuccess, onFailure) {
  AsyncStorage.getItem("login").then(
    (res) => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("login data Null");
      }
    },
    (err) => onFailure(err)
  );
}

export function clearLogin(onSuccess, onError) {
  AsyncStorage.removeItem("login").then(
    (response) => {
      onSuccess(response);
    },
    (error) => {
      onError(error);
    }
  );
}

export function getUserToken(onSuccess, onFailure) {
  AsyncStorage.getItem("login").then(
    (res) => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Token Null");
      }
    },
    (err) => onFailure(err)
  );
}

export function saveCartData(details, onSuccess, onFailure) {
  AsyncStorage.setItem("cartList", JSON.stringify(details)).then(
    (success) => {
      onSuccess(success);
    },
    (error) => onFailure(error)
  );
}

export function clearCartData(onSuccess, onError) {
  AsyncStorage.removeItem("cartList").then(
    (response) => {
      onSuccess(response);
    },
    (error) => {
      onError(error);
    }
  );
}

export function getCartList(onSuccess, onCartNotFound, onFailure) {
  AsyncStorage.getItem("cartList").then(
    (response) => {
      if (response != "" && response != null && response != undefined) {
        onSuccess(JSON.parse(response));
      } else {
        onCartNotFound(response);
      }
    },
    (error) => {
      onFailure(error);
    }
  );
}

export function saveLanguages(details, onSuccess, onFailure) {
  AsyncStorage.setItem("language", JSON.stringify(details)).then(
    (success) => onSuccess(success),
    (err) => onFailure(err)
  );
}

export function getLanguages(onSuccess, onFailure) {
  AsyncStorage.getItem("language").then(
    (res) => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("english");
      }
    },
    (err) => onFailure(err)
  );
}
export function saveLanguage(lan, onSuccess, onFailure) {
  AsyncStorage.setItem(StorageKeys.lan, JSON.stringify(lan)).then(
    (success) => {
      onSuccess(success);
    },
    (error) => {
      onFailure(error);
    }
  );
}

export function getLanguage(onSuccess, onFailure) {
  AsyncStorage.getItem(StorageKeys.lan).then(
    (res) => {
      onSuccess(JSON.parse(res));
    },
    (error) => {
      onFailure("error");
    }
  );
}

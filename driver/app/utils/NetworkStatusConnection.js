import { NetInfo } from "react-native";

export const netStatus = (callback) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    callback(isConnected);
  });
};

export const netStatusEvent = (callback) => {
  NetInfo.isConnected.addEventListener("connectionChange", status => {
    callback(status);
  });
};

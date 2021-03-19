// import { NetInfo } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const netStatus = (callback) => {
  NetInfo.fetch().then(isConnected => {
    callback(isConnected);
  });
};

export const netStatusEvent = (callback) => {
  NetInfo.addEventListener("connectionChange", status => {
    callback(status);
  });
};

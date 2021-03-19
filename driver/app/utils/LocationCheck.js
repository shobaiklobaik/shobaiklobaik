import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import React from "react";
import { DeviceEventEmitter } from "react-native";

export const isLocationEnable = (onSuccess, onError, onBackPress) => {
  LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message:
      "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/>",
    ok: "YES",
    cancel: "NO",
    enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    showDialog: true, // false => Opens the Location access page directly
    openLocationServices: true, // false => Directly catch method is called if location services are turned off
    preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
    preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
    providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
  })
    .then(success => {
      onSuccess(success);
    })
    .catch(error => {
      onError(error);
      console.log(error.message);
    });

  DeviceEventEmitter.addListener("locationProviderStatusChange", function(
    status
  ) {
    onBackPress(status);
  });
};

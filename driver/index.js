/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase, { RemoteMessage } from 'react-native-firebase';
// import  { RemoteMessage } from 'react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);



const handleFCMNotification = async (message) => {
    console.log('FCM OFFLINE: ', message);
    return Promise.resolve();
  }

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => handleFCMNotification);
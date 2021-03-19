import React from 'React'
import { NetInfo, Alert } from 'react-native'


/**
 * Generic function to check network connectivity prior to each api call
 * @param {checkNetInfo} callBack method to be called after positive user alert
 * @param {checkNetInfo} methodToCall method callback used to fetch methods on successfull network check
 * @param {checkNetInfo} url 
 * @param {checkNetInfo} body 
 * @param {checkNetInfo} responseSuccess 
 * @param {checkNetInfo} responseErr 
 * @param {checkNetInfo} requestHeader 
 */
export default function checkNetInfo(callBack,methodToCall,url, body, responseSuccess, responseErr, requestHeader) {
    methodToCall(url, body, responseSuccess, responseErr, requestHeader)
    // NetInfo.isConnected.fetch().then(isConnected => {
    //     if (isConnected) {
    //         methodToCall()
    //     } else {
    //         Alert.alert(
    //             'Network Unavailable',
    //             'Need Internet connection to make things work',
    //             [
    //                 { text: 'OK', onPress: () => { callBack() } },
    //             ],
    //             { cancelable: false }
    //         )
    //     }

    // });



}
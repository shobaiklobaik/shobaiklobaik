import { Alert } from "react-native";
import { AlertButtons, DEFAULT_ALERT_TITLE } from "../utils/Constants";
import { Messages } from '../utils/Messages';

export function showDialogue(message,arrayButtons,title = DEFAULT_ALERT_TITLE, okButtonHandler = () => {

}) {
    arrayButtonsToShow = arrayButtons.concat([{"text":AlertButtons.ok, onPress: okButtonHandler}])

    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}

export function showLogoutAlertWithCompletion(onYesClick) {
    Alert.alert(
        Messages.logoutConfirmation,
        "",
        [{"text":AlertButtons.no},{"text":AlertButtons.yes, onPress: () => onYesClick()}],
        { cancelable: false }
      )
}

export function showNotImplementedAlert() {
    arrayButtonsToShow = [{"text":AlertButtons.ok}]
    Alert.alert(
        Messages.notImplementedTitle,
        Messages.notImplementedMessage,
        arrayButtonsToShow,
        { cancelable: false }
      )
}

export function showValidationAlert(msg) {
    arrayButtonsToShow = [{"text":AlertButtons.ok}]
    Alert.alert(
        Messages.appName,
       msg,
        arrayButtonsToShow,
        { cancelable: false }
      )
}


export function showDialogueNew(message,arrayButtons,title = DEFAULT_ALERT_TITLE, okButtonHandler = () => {

}) {
    arrayButtonsToShow = arrayButtons.concat([{"text":AlertButtons.cancel, onPress: okButtonHandler}])
    arrayButtonsToShow = (arrayButtons || []).concat([
        { text: "Ok", onPress: okButtonHandler }
      ]);
    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}
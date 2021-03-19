import { Alert } from "react-native";
import { AlertButtons, DEFAULT_ALERT_TITLE } from "../utils/Constants";
import { Messages } from '../utils/Messages';
import { strings } from "../locales/i18n";

export function showDialogue(
  message,
  arrayButtons,
  title = "",
  okButtonHandler = () => {
    // title.fontcolor(color="red")
  }
) {
  arrayButtonsToShow = (arrayButtons || []).concat([
    {
      text: strings("dialog.okay"),
      style: "default",
      onPress: okButtonHandler
    }
  ]);
  Alert.alert(title, message, arrayButtonsToShow, { cancelable: false });
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
    arrayButtonsToShow = [{"text":strings("dialog.okay")}]
    Alert.alert(
        Messages.notImplementedTitle,
        Messages.notImplementedMessage,
        arrayButtonsToShow,
        { cancelable: false }
      )
}

export function showValidationAlert(msg) {
    arrayButtonsToShow = [{"text":strings("dialog.okay")}]
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
        { text: strings("dialog.okay"), onPress: okButtonHandler }
      ]);
    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}
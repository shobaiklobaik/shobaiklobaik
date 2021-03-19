import { Messages } from "../utils/Messages";

export default class Validations {
  isUrl(strToCheck) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(strToCheck);
  }
  // This function is used for checking type od EDTextField and accordingly secures the text entry
  checkingFieldType = fieldType => {
    if (fieldType === "password") {
      return true;
    } else {
      return false;
    }
  };

  checkForEmpty = text => {
    if (text.length == 0) {
      return {
        isEmpty: true,
        validationErrorMessage: "asdasdasdasasdas"
      };
    }
  };

  // Function for performing email validations
  validateEmail = text => {
    console.log(text);

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (reg.test(text) === false) {
      return {
        validEmail: false,
        validationErrorMessage: Messages.validEmail
      };
    } else {
      return {
        validEmail: true,
        validationErrorMessage: "Email is Correct"
      };
    }
  };

  // Function for performing Password validations
  validatePassword = text => {


    let reg = /^([a-zA-Z0-9@*#]{8,15})$/;

    if (reg.test(text) === false) {
      return {
        validPassword: false,
        validationErrorMessage: Messages.validPassword
      };
    } else {
      return {
        validPassword: true,
        validationErrorMessage: "Password is Correct"
      };
    }
  };
}

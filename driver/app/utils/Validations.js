
import { strings } from "../locales/i18n";

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

  // checkForEmpty = text => {
  //   if (text.length == 0) {
  //     return {
  //       isEmpty: true,
  //       validationErrorMessage: "asdasdasdasasdas"
  //     };
  //   }
  // }

  // Function for performing email validations
  validateEmail = (text, message = "This is a required field") => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // console.log("Regular Expression test is " + reg.test(text));
    if (text.trim() === "") {
      return message;
    } else if (reg.test(text) === false) {
      return strings("validationMsg.emailValidate");
    } else {
      return "";
    }
  };

  validateMobile = (number, message) => {

    // let reg = /^\d{10}$/;
    let reg = /^[0-10]{10}$/;
    
    if (number === "") {
      return message;
    // } 
    // else if (reg.test(number) === false) {
    //   return strings("validationMsg.validMobileNumber")
    } if (number.length < 9){
          return strings("validationMsg.validMobileNumber")
    }else {
      return ""
    }

  }

  // Function for performing Password validations
  validatePassword = (text, message = "This is a required field") => {
    // console.log(text);
    let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*)(])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*)(]{8,}$/;
    // let reg = /^([a-zA-Z0-9@*#]{2,15})$/;
    // console.log("Regular Expression test is " + reg.test(text));
    if (text === "") {
      return message;
    } else if (reg.test(text) === false) {
      return strings("validationMsg.validPassword");
    } else {
      return "";
    }
  };

  validationName = (text, message = "") => {

    // let reg = /^[A-Za-z]+$/;
    let reg = /^[a-zA-Z\s]*$/;
    if(text === ""){
      return message
    }else if(reg.test(text) == false){
      return strings("validationMsg.validatemptyfield")
    }else{
      return "";
    }
  }

  validateEmpty = (text, message) => {
    if (text.trim() == "") {
      return message;
    }
    return ""
  };

  ValidateConfirmPassword = (text, text1, message = "Confirm password Not Proper") => {
    if (text1 === "") {
      return strings('validationMsg.emptyconfirmPassword');
    } else if (text !== text1) {
      return strings('validationMsg.confirmPasswordMismatch')
    } else {
      return ""
    }
  }
}

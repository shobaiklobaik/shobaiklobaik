/**
 * EDTextInput is a generalized text inputs to be used in this project.
 * It uses react text field.
 * Props of EDTextField:
 * - Label: gives a floating label to the text field
 * - Type: gives the type of text field stored as const in TextFieldTypes.js
 * - errorCheck: sets the boolean isError according to the state.
 */

import React, { Component } from "react";
import { TextField } from "react-native-material-textfield";
import { EDColors } from "../assets/Colors";
import Validations from "../utils/Validations";
import { TextFieldTypes } from "../utils/TextFieldTypes";

export default class EDTextInput extends TextField {
  constructor(props) {
    super(props);
    this.state = {
      placeholderText: "",
      userText: "", //stores the input text
      errorMessage: "", //stores the error message to be printed below the text input
      isError: false //stores the state of error
    };
    this.validations = new Validations(); //creating an object of the validations class
  }

  // This functions checks the type of EDTextInput and performs validations by calling functions
  // from validations class.
  valid = text => {
    //   if (this.state.userText.trim() === "") {
    //     this.setState({ isError: true, errorMessage: "Please enter " + this.props.label })
    //     this.state.isError = true
    //     return this.state.errorMessage
    // }

    switch (
      this.props.type //Checking the type of TextField
    ) {
      case "email":
        emailValidationResult = this.validations.validateEmail(text);
        if (emailValidationResult.validEmail === false) {
          this.setState({
            userText: text,
            isError: true,
            errorMessage: emailValidationResult.validationErrorMessage
          });
        } else {
          this.setState({ userText: text, isError: false, errorMessage: "" });
        }
        break;
      case "password":
  
        passwordValidationResult = this.validations.validatePassword(text);
        if (passwordValidationResult.validPassword === false) {
          this.setState({
            userText: text,
            isError: true,
            errorMessage: passwordValidationResult.validationErrorMessage
          });
        } else {
          this.setState({ userText: text, isError: false, errorMessage: "" });
          this.state.isError = false;
        }
        break;
      default:
        if (text != "") {
          this.setState({ userText: text, isError: false, errorMessage: "" });
        }
    }
  };

  componentDidMount() {
    this.state.placeholderText = this.props.label;
  }

  getKeyboardType() {
    switch (this.props.type) {
      case TextFieldTypes.email:
        return "email-address";

      case TextFieldTypes.password:
        return "default";

      case TextFieldTypes.phone:
        return "numeric";

      case TextFieldTypes.accountNumber:
        return "numeric";
    }
  }

  render() {
    return (
      <TextField
      lineWidth = {this.props.lineWidth}
        label={this.props.label}
        tintColor={EDColors.primary}
        baseColor={EDColors.placeholder}
        textColor={EDColors.text}
        disabled={
          this.props.isUserInteractionDisabled != undefined
            ? this.props.isUserInteractionDisabled
            : false
        }
        value={
          this.props.initialText != undefined
            ? this.props.initialText
            : this.props.value
        }
        errorColor="red"
        onChangeText={text => {
          this.valid(text);
          if (this.props.textDidChange != undefined) {
            this.props.textDidChange(text);
          }
        }}
        onBlur={() => {
          // After clicking outside the textField
          if (this.props.errorCheck != undefined) {
            //checks the condition for error check
            this.props.errorCheck(this.state.isError); //sends the state variable to the isError to the prop errorCheck callBack function
          }
        }}
        onFocus={() => {
          //After clicking on TextField again
          this.setState({ errorMessage: "", isError: false }); //removes the error message
        }}
        secureTextEntry={this.validations.checkingFieldType(this.props.type)} //checks the fieldType and accordingly secures the textinput
        error={
          this.state.errorMessage.trim().length > 0
            ? this.state.errorMessage
            : this.props.errorFromScreen //Sets the error message below the textinput
        }
        keyboardType={this.getKeyboardType()}
      />
    );
  }
}

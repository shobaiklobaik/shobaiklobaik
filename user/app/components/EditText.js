import React from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import {EDColors} from '../assets/Colors';
import {Card} from 'native-base';

export default class EditText extends React.Component {
  render() {
    return (
      <View style={[style.editText, {elevation: 8}, this.props.styles]}>
        {/* {this.props.isCode ?
          <View style={{ justifyContent: 'center', marginRight : 10 }}>
            <Text style={{ alignSelf: 'center' }}>
              {this.props.codeLabel}
            </Text>
          </View>
          : null} */}
        <TextInput
          style={
            {
              flex: 1,
              marginVertical: Platform.OS == 'ios' ? 10 : 0,
              fontSize: 16,
              color: '#000',
            }
            // ]|| {}
          }
          placeholderTextColor="#C7C7CD"
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.props.secureTextEntry}
          editable={this.props.editable}
          maxLength={
            this.props.maxLength != undefined ? this.props.maxLength : 30
          }
          multiline={
            this.props.multiline != undefined ? this.props.multiline : false
          }
          onChangeText={userText => {
            if (this.props.onChangeText != undefined) {
              this.props.onChangeText(userText);
            }
          }}
          value={this.props.value}
          placeholder={this.props.hint}
          returnKeyType="done"
        />
      </View>
    );
  }
}

export const style = StyleSheet.create({
  editText: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: EDColors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomWidth: 2,
    marginTop: 10,
    paddingHorizontal: 10,
    // fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 8
    // boxshadow: 10 5 5 black;
  },
});

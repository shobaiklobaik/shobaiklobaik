import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, Image, Text, View} from 'react-native';
import styles from '../stylesheet/stylesheet';
import FastImage from 'react-native-fast-image';

export default class SideMenuComponent extends React.PureComponent {
  //   state = {
  //     url: ""
  //   };

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.imageUrl,
      view: this.props.display,
      itemName: this.props.itemName,
    };
  }

  changeStyle() {}

  render() {
    // this.state.view;
    return (
      <View style={styles.navItem}>
        <FastImage
          style={{alignSelf: 'center', width: 15, height: 15}}
          source={this.state.url}
        />

        <Text
          style={
            this.state.isSelected
              ? styles.sideMenuTextSelected
              : styles.sideMenuText
          }
          onPress={() => {
            this.props.click(this.props.itemName);
          }}>
          {this.props.itemName}
        </Text>
      </View>
    );
  }
}

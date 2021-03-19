import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Spinner } from "native-base";
import { EDColors } from "../assets/Colors";

export default class ProgressLoader extends React.Component {
  render() {
    return (
      <View style={STYLES.container}>
        <View style={STYLES.containerOpac} />
        <Spinner style={STYLES.spinner} color={EDColors.primary} />
      </View>
    );
  }
}

const STYLES = StyleSheet.create({
  container: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: 997
  },
  containerOpac: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998
  },
  spinner: {
    flex: 1,
    alignSelf: "center",
    zIndex: 1000
  }
});

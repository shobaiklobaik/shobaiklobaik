import React from "react";
import {
  View, StyleSheet
} from "react-native";
import { Container } from "native-base";
import NavBar from "../components/NavBar";
import ProgressLoader from "../components/ProgressLoader";
import { EDColors } from "../assets/Colors";
import { netStatusEvent } from "../utils/NetworkStatusConnection";

export default class BaseContainer extends React.Component {
  componentDidMount() {
    netStatusEvent(status => {
   
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
            <NavBar
                title={this.props.title}
                left={this.props.left}
                onLeft={this.props.onLeft}
                right={this.props.right}
                onRight={this.props.onRight}
                // primaryColor={this.props.primaryColor}
                primaryColor = {EDColors.primary}
                isLeftString={this.props.isLeftString}
            />

            <View style={styles.container}>
                {this.props.children}
            </View>

            {this.props.isLoading ? <ProgressLoader primaryColor={this.props.loadingColor || EDColors.primary} /> : null}

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  children: {

  }
});
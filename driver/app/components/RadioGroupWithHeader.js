import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { ETFonts } from "../assets/FontConstants";

export default class RadioGroupWithHeader extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    data: this.props.data,
    selected: ""
  };

  onPress = data => {};

  render() {
    return (
      <View style={style.container}>
        <Text style={style.title}>{this.props.title}</Text>

        <View style={{ alignItems: "flex-start" }}>
          <RadioGroup
            color={this.props.color}
            flexDirection="row"
            fontFamily={ETFonts.regular}
            radioButtons={this.state.data}
            onPress={data => {
              this.setState({ data });
              this.state.data.find(e => {
                if (e.selected == true) {
                  this.props.onSelected(e.label);
                }
              });
            }}
            style={{
              alignItems: "flex-start",
              color: "#000",
              fontFamily: ETFonts.regular
            }}
          />
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    backgroundColor: "#fff",
    margin: 10
  },
  title: {
    fontFamily: ETFonts.bold,
    color: "#000",
    fontSize: 14
  },
  radioContainer: {
    flexDirection: "row"
  }
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";
import metrics from "../utils/metrics";

export default class ETSlider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sliderOneValue: [this.props.initialValue],
      value: this.props.initialValue,
      valueType: this.props.valueType
    };
  }
  render() {
    // const { value } = this.state;
    return (
      <View style={style.container}>
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={style.title}>{this.props.title}</Text>
            <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#000"
              }}
            >
              {this.state.value}
            </Text>
            <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#000",
                marginLeft: 4
              }}
            >
              {this.state.valueType}
            </Text>
          </View>
          <MultiSlider
            values={this.state.sliderOneValue}
            sliderLength={metrics.screenWidth - 70}
            onLayout={event => {
              this.slider_bound(event);
            }}
            selectedStyle={{
              backgroundColor: EDColors.primary
            }}
            max={this.props.max}
            min={this.props.min}
            onValuesChange={values => {
              let newValues = [0];
              newValues[0] = values[0];
              this.props.onSlide(newValues[0]);
              this.setState({ value: newValues[0] });
            }}
            customMarker={() => {
              return <View style={style.marker} />;
            }}
            touchDimensions={{
              width: metrics.screenWidth - 70
            }}
            snapped
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
    flex: 1,
    fontFamily: ETFonts.bold,
    color: "#000"
  },
  marker: {
    borderRadius: 15,
    width: 15,
    height: 15,
    backgroundColor: EDColors.primary
  }
});

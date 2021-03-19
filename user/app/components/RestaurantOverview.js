import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextViewLeftImage from "./TextViewLeftImage";
import Assets from "../assets";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";
import { capitalize } from "../utils/Constants";
import { strings } from "../locales/i18n";

export default class RestaurantOverview extends React.PureComponent {
  constructor(props) {
    super(props);

   
	  	  this.close =strings('RestaurantOverview.Close');   
        this.menu=strings('RestaurantOverview.Menu');  
  }
  render() {
    return (
      <View style={style.container}>
        <Text
          style={{
            fontFamily: ETFonts.regular,
            color: "#000",
            fontSize: 20
          }}
        >
          {this.props.resName}
        </Text>
        <TextViewLeftImage
          image={Assets.address}
          text={this.props.address}
          lines={0}
        />
        <View style={{ marginTop: 10, height: 1, backgroundColor: "#000" }} />

        <View
          style={{
            flex: 1,
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {this.props.review != null && this.props.review.length > 0 ? (
            <TextViewLeftImage
              image={Assets.rating}
              text={this.props.review}
              lines={0}
            />
          ) : null}

          <View style={{ flex: 2 }}>
            {/* {this.props.timing != "" ? ( */}
              <TextViewLeftImage
                image={Assets.time}
                text={this.props.timing != "" && this.props.timing != "-" ? this.props.timing : this.close}
                lines={0}
              />
            {/* ) : null} */}
          </View>

          {this.props.isShow ? (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                this.props.onButtonClick("");
              }}
              style={{ flex: 1 }}
            >
              <TextViewLeftImage
                image={Assets.restMenu}
                text={strings('RestaurantOverview.Menu')}
                lines={0}
              />
            </TouchableOpacity>
          ) : null}
          {/* <View activeOpacity={1.0} style={style.button}>
            <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#fff",
                fontSize: 12
              }}
            >
              {capitalize(this.props.buttonText)}
            </Text>
          </View> */}
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 8
  },
  button: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center"
  }
});

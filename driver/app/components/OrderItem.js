import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ETFonts } from "../assets/FontConstants";
import { Rating } from "react-native-ratings";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";

export default class OrderItem extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={style.container}>
        <Image style={style.itemImage} source={{ uri: this.props.itemImage }} />

        <View style={{ flex: 4, marginTop: 10, marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: this.props.isVeg == "1" ? "#239957" : "#A52A2A",
                alignSelf: "center"
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  margin: 2,
                  borderRadius: 6,
                  backgroundColor:
                    this.props.isVeg == "1" ? "#239957" : "#A52A2A"
                }}
              />
            </View>
            <Text style={style.itemName}>{this.props.itemName}</Text>
          </View>
          <Text style={{ margin: 2 }}>{this.props.quantity}</Text>
          <Text style={style.price}>{this.props.price}</Text>
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
  
    borderRadius: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  itemImage: {
    flex: 2,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 3,
    marginTop: 3
  },
  itemName: {
    fontSize: 18,
    fontFamily: ETFonts.bold,
    color: "#000",
    marginLeft: 5
  },
  qunContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    justifyContent: "flex-end"
  },
  roundButton: {
    margin: 2,
    borderRadius: 10,
    backgroundColor: EDColors.primary,
    justifyContent: "center"
  },
  price: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    fontFamily: ETFonts.regular
  },
  deleteContainer: {
    flex: 0.8,
    backgroundColor: EDColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  }
});

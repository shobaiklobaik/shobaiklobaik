import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  AsyncStorage,
  StyleSheet
} from "react-native";
import { Rating } from "react-native-ratings";
import { ETFonts } from "../assets/FontConstants";
import Assets from "../assets";
import { EDColors } from "../assets/Colors";

export default class ReviewContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stars: 7
    };
  }

  onStarRatingPress(rating) {
    this.setState({ stars: rating });
  }

  render() {
    return (
      <View style={style.container}>
        <Image
          style={style.image}
          source={
            this.props.userImage != ""
              ? { uri: this.props.userImage }
              : Assets.user_placeholder
          }
        />

        <View style={style.detail}>
          <Text style={style.detailName}>{this.props.name}</Text>
          <Text style={style.review}>"{this.props.review}"</Text>
          <Rating
            readonly={this.props.readonly}
            style={{ marginTop: 8 }}
            imageSize={this.props.size}
            ratingCount={5}
            startingValue={parseFloat(this.props.rating)}
            onFinishRating={star => {
           
              this.props.onReview(star);
            }}
          />
        </View>
        <View>
          <Text style={style.date}>{this.props.date}</Text>
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 7,
    flex:1,
    borderColor:EDColors.primary,
    borderWidth:1
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center"
  },
  detail: {
    flex: 4,
    marginLeft: 10
  },
  detailName: {
    color: "#000",
    fontSize: 15,
    fontFamily: ETFonts.bold
  },
  review: {
    marginTop: 8,
    fontFamily: ETFonts.regular
  },
  date: {
    flex: 1,
    fontSize: 12,
    alignSelf: "center",
    fontFamily: ETFonts.regular
  }
});

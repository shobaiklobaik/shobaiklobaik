import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import {ETFonts} from '../assets/FontConstants';

export default class PriceDetail extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const {itemTitle, priceTitle} = this.props;
    return (
      <View style={style.container}>
        <Text style={itemTitle ? itemTitle : style.itemTitle}>
          {this.props.title}
        </Text>
        <Text style={priceTitle ? priceTitle : style.price}>
          {this.props.price}
        </Text>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  price: {
    fontFamily: ETFonts.regular,
    fontSize: 15,
  },
  itemTitle: {
    flex: 1,
    fontFamily: ETFonts.regular,
    textAlign: 'left',
    fontSize: 15,
  },
});

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  SectionList,
  ScrollView,
  Linking,
  View
} from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";
import metrics from "../utils/metrics";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class SegmentComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedIndex: 0
  };

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });

    if (this.props.onIndexChange != undefined) {
      this.props.onIndexChange(index) // this prop handles the indexes in parent component. 
    }
  };

  componentWillReceiveProps(newProps) {
    this.setState({ selectedIndex: 0 })
  }

  render() {
    return (
      // <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
      <View style={{ flex: 1, backgroundColor: EDColors.background }}>
        <View style={{ padding: metrics.screenWidth * 0.05 }}>
          {/* <View style = {{borderRadius:5, borderWidth:1, borderColor:EDColors.primary}}> */}
          <SegmentedControlTab
            // tabsContainerStyle = {
            // this.props.style}
            tabStyle={{ width: metrics.screenWidth * 0.855, height: metrics.screenHeight * 0.076, borderColor:EDColors.primary}}
            // tabStyle={{borderColor: EDColors.primary }}
            tabTextStyle={{ color: EDColors.primary, fontFamily: ETFonts.regular, fontSize: hp('2.5%') }}
            activeTabStyle={{ backgroundColor: EDColors.primary }}
            activeTabTextStyle={{
              //backgroundColor: AHColors.chartBG
              // color: this.props.primaryColorSelected,
              color: EDColors.white,
            }}
            values={this.props.arrayList}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            borderColor={this.props.primaryColor}
            allowFontScaling={false}
            borderRadius={0}
          />
          {/* </View> */}
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          scrollEnabled={false}
          onScroll={() => {
            this.setState({
              selectedIndex: this.state.selectedIndex == 0 ? 1 : 0
            });
          }}
          contentContainerStyle={{ flex: 1 }}
        >
          {this.state.selectedIndex == 0 ? (
            <View
              style={{
                // width: Metrics.screenWidth - 20,
                flex: 1
                // paddingBottom: 20
              }}
            >
              {this.props.firstView}
            </View>
          ) : (
              <View
                style={{
                  // width: Metrics.screenWidth - 20,
                  flex: 1
                }}
              >
                {this.props.secondView}
              </View>
            )}
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: EDColors.primaryColorSelected,
    // borderBottomColor: EDColors.titleBackground,
    // borderTopColor: 'white',
    // borderLeftColor: 'white',
    // borderRightColor: 'white',
  },
  tabTextStyle: {
    color: EDColors.black,
    fontFamily: ETFonts.regular
  },

  tabBadgeStyle: {
    //custom styles
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  }
});

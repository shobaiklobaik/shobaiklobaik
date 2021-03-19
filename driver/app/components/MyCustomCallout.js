import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import metrics from "../utils/metrics";
import Assets from "../assets";
import EDRTLView from "./EDRTLView";
import { ETFonts } from "../assets/FontConstants";
import { isRTLCheck } from "../utils/Constants";

export default class MyCustomCallout extends React.Component {

    render(){
        return(
            <View>
            <EDRTLView style = {{width: metrics.screenWidth * 0.483}}>
                <Image source = {this.props.image} style = {{borderRadius:5, overflow:"hidden", width: metrics.screenWidth * 0.10, height: metrics.screenWidth * 0.10}}/>
                <View style = {{marginHorizontal:10}}>
                    <Text style = {{fontFamily: ETFonts.regular}}>{this.props.title}</Text>
                    <Text style = {{fontFamily: ETFonts.light}}>{this.props.discription}</Text>
                </View>
                <TouchableOpacity
                style={{alignSelf:isRTLCheck() ? 'flex-start' : 'flex-end',
                        // marginBottom: - metrics.screenHeight * 0.025, 
                        width: 40, 
                        height: 40,
                        marginLeft: metrics.screenWidth * 0.10,
                        zIndex:1000,
                        // borderWidth:1 
                        }}
                        onPress = {this.props.onPress}
                        >
                        <Image
                           style={{ width: 40, height: 40 }}
                           resizeMode='center'
                           source={Assets.call_order} 
                        />
                   </TouchableOpacity>
            </EDRTLView>
            </View>
        )
    }
}
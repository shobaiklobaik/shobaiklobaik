import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    TextInput,
    Image,
    Platform
} from "react-native";

import { EDColors } from "../assets/Colors";
import { EDFonts, ETFonts } from "../assets/FontConstants";
import { TextFieldTypes, isRTLCheck, COUNTRY_CODE } from "../utils/Constants";
import EDRTLView from "./EDRTLView";
import { isRTL, strings } from "../locales/i18n";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import metrics from "../utils/metrics";
import EDText from '../components/EDText';

export default class ProfileComponent extends Component {

    constructor(props) {
        super(props);
        this.secondTextInputRef = React.createRef()
    }

    state = {
        value: this.props.value,
        isVisible: false
    }

    componentWillReceiveProps(props) {
        this.props = props
        this.setState({ value: props.value })
    }

    firstText = () => {
        // this.setState({isVisible: true})
        this.secondTextInputRef = React.createRef();
    }

    render() {
        return (
            // <View
            //     style={[
            //         this.props.style,
            //         {
            //             height: metrics.screenWidth * 0.3,
            //             backgroundColor: EDColors.white,
            //         }
            //     ]}
            //     pointerEvents={this.props.isDisable ? "none" : "auto"}
            // >
            <EDRTLView
                style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: EDColors.white,
                    height: metrics.screenWidth * 0.3,
                    // borderWidth: 1,
                    justifyContent:'space-between',
                    // width: metrics.screenWidth * 0.94,
                    // borderColor:'red'
                }}
            >
                <View style={{ height: metrics.screenWidth * 0.3 }}>
                    <Image style={[styles.image, { tintColor: this.props.tintColor }]} source={this.props.imagePerson} />
                    {this.props.error ? <Text>{"  "}</Text>: null}
                    <Image style={[styles.image, { tintColor: this.props.tintColor }]} source={this.props.imageCall} />
                </View>

                <View style={{height: metrics.screenWidth * 0.3 }}>
                    <EDRTLView style={{ width: metrics.screenWidth * 0.8, justifyContent: 'space-between' }}>
                        <TextInput
                            editable={this.props.isEditable}
                            value={this.props.value}
                            ref={(input) => { this.secondTextInput = input; }}
                            style={{
                                width: metrics.screenWidth * 0.65,
                                textAlign: isRTLCheck() ? "right" : "left",
                                fontSize: hp("2.0%"),
                                // borderWidth: 1
                                // padding: 0,
                            }}
                            onChangeText={(newValue) => {
                                this.props.onChangeText(newValue)
                            }}
                        />
                        <TouchableOpacity onPress={() => {
                            this.secondTextInput.focus()
                        }}
                            activeOpacity={1.0}
                        >
                            <Image style={[styles.image, {}]} source={this.props.sourceImage} />
                        </TouchableOpacity>
                    </EDRTLView>
                    {this.props.error ? <Text style = {{color:'red'}}>{this.props.error}</Text> : null}
                    <View style={{ borderColor: 'grey', borderWidth:0.5 }} />
                    <EDRTLView>
                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <EDText style={{ marginVertical: metrics.screenWidth * 0.05, fontSize: hp("2.0%") }} label={this.props.number} />
                        </TouchableOpacity>
                    </EDRTLView>
                </View>
            </EDRTLView>

            // {this.props.error ? (
            //     <EDRTLView>
            //         <Text style={styles.errorTextStyle}>{this.props.error}</Text>
            //     </EDRTLView>
            // ) : null}
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    errorTextStyle: {
        fontSize: hp("1.7%"),
        fontFamily: ETFonts.regular,
        color: EDColors.error
    },
    image: {
        width: metrics.screenWidth * 0.046,
        height: metrics.screenWidth * 0.046,
        margin: metrics.screenWidth * 0.046,
        // borderWidth: 1,
        borderColor: 'green'
    }
});

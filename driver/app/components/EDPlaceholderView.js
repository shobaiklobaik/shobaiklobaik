import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export default class EDPlaceholderView extends React.PureComponent {
    render() {
        return (
            <View
                style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: 'center',
                    padding: 20
                }}
            >
                <View style={{}}>
                    {/* <Image source={Assets.logo} /> */}
                    {this.props.iconToDisplay ? <Image source={this.props.iconToDisplay} /> : null}
                    <Text style={EDStyles.noDataTitlePlaceholderView}>
                        {this.props.messageToDisplay || ""}
                    </Text>
                </View>
            </View>
        );
    }
}

const EDStyles = StyleSheet.create({


    noDataTitle: {
        fontSize: 16,
        color: EDColors.text,
        fontFamily: ETFonts.light,
        margin: 15,
        marginVertical: 40,
        textAlign: 'center',
    },
    noDataTitlePlaceholderView: {
        fontSize: 16,
        color: EDColors.secondary,
        fontFamily: ETFonts.regular,
        textAlign: 'center',
    },
});

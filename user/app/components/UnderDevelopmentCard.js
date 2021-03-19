import React from 'react'
import { View, Text } from 'react-native'
import { EDStyles } from "../stylesheet/EDStyleSheet";
import { Messages } from "../utils/Messages";
import { Card } from "native-base";

export default class UnderDevelopmentCard extends React.PureComponent {
    render() {
        return (
            <View style={{ flex: 1,  alignItems:"center", justifyContent:"center" }}>
                <Card>
                        <Text style={EDStyles.notImplementedTitle}>
                            {Messages.notImplementedTitle}
                        </Text>
                        <Text style={EDStyles.notImplementedMessage}>
                            {Messages.notImplementedMessage}
                        </Text>
                </Card>
            </View>
        );
    }
}
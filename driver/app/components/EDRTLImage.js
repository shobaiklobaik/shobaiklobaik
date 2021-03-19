
import React from 'react'
import { View, Image } from 'react-native'
import { isRTLCheck } from '../utils/Constants';


export default class EDRTLImage extends React.Component {

    render() {
        return (<Image
            source={this.props.source}
            resizeMode='stretch'
            style={[{ transform: [{ scaleX: isRTLCheck() ? -1 : 1 }] }, this.props.style]}
        />)
    }
}
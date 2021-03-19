import React from 'react'
import { View, FlatList } from 'react-native'
import { strings, isRTL } from "../locales/i18n";
import { isRTLCheck } from '../utils/Constants';
import EDRTLView from './EDRTLView';

export default class EDRTLFlatList extends React.Component {

    render() {
        return (

            <FlatList
                showsHorizontalScrollIndicator={false}
                style={[{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }, this.props.style]}
                data={this.props.data}
                extraData={this.props.extraData}
                renderItem={this.props.renderItem}
                numColumns={this.props.numColumns}
                keyExtractor={this.props.keyExtractor}
            />
            )
    }
}
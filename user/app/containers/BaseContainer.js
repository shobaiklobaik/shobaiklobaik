import React from 'react';
import {Container} from 'native-base';
import NavBar from './NavBar';
import ProgressLoader from '../components/ProgressLoader';
import {EDColors} from '../assets/Colors';
import {netStatusEvent} from '../utils/NetworkStatusConnection';

export default class BaseContainer extends React.Component {
  componentDidMount() {
    // netStatusEvent(status => {});
  }

  render() {
    return (
      <Container>
        <NavBar
          title={this.props.title}
          left={this.props.left}
          onLeft={() => {
            this.props.onLeft();
          }}
          right={this.props.right}
          onRight={index => {
            this.props.onRight(index);
          }}
        />
        {this.props.loading ? <ProgressLoader /> : null}
        <Container style={{backgroundColor: EDColors.backgroundDark}}>
          {this.props.children}
        </Container>
      </Container>
    );
  }
}

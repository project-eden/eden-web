import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InfoCard.css';

class InfoCard extends Component {

  render() {
    return (
      <div className="InfoCard">
        <div></div>
        <h1>{ `${this.props.crop}: ${this.props.value}` }</h1>
      </div>
    );
  }
}

InfoCard.propTypes = {
  crop: PropTypes.string, // Name of crop to display.
  value: PropTypes.number // Value to display.
};

export default InfoCard;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strings from 'constants/strings.json';
import './InfoCard.css';

class InfoCard extends Component {

  render() {
    return (
      <div className="InfoCard">
        <div className="Potential">
          <h5 className="InfoHeader">{ strings.potentialProd }</h5>
          <h3>{ strings.unknown }</h3>
        </div>
        <div className="Actual">
          <h5 className="InfoHeader">{ strings.actualProd }</h5>
          <h3>{ `${strings[this.props.crop]}: ${this.props.value}` }</h3>
        </div>
      </div>
    );
  }
}

InfoCard.propTypes = {
  crop: PropTypes.string, // Name of crop to display.
  value: PropTypes.number // Value to display.
};

export default InfoCard;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strings from 'constants/strings.json';
import './InfoCard.css';

class InfoCard extends Component {

  constructor() {
    super();
    this.state = {
      topCrop: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.cropData.length > 0) {
      const topCrop = nextProps.cropData[0],
        name = topCrop[0],
        value = topCrop[1];

      return {
        topCrop: {name, value}
      };
    }
    return null;
  }

  logIt() {
    console.log('a');
  }

  render() {
    return (
      <div className='InfoCard'>
        <div className='Actual'>
          <h5 className='InfoHeader'>{ strings.actualProd }</h5>
          <h3>{ `${strings[this.state.topCrop.name] || strings.unknown}: ${this.state.topCrop.value || ''}` }</h3>
        </div>
        <div className='Potential'>
          <h5 className='InfoHeader'>{ strings.potentialProd }</h5>
          <h3>{ strings.unknown }</h3>
        </div>
      </div>
    );
  }
}

InfoCard.propTypes = {
  cropData: PropTypes.array // Array of data to display.
};

export default InfoCard;

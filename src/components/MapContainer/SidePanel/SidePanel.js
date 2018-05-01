import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strings from 'constants/strings.json';
import './SidePanel.css';

class SidePanel extends Component {

  listTopCrops() {
    return this.props.cropData.map((crop, key) => {
      const cropName = strings[crop[0]],
        value = crop[1]

      return (
        <div style={ !this.props.open ? { display: 'none' } : {color: 'white'} } key={ key }>
          { `${cropName}: ${value}` }
        </div>);
    });
  }

  render() {
    return (
      <div className='SidePanel' style={ { width: this.props.open ? '350px' : '', padding: this.props.open ? '50px 25px' : ''} }>
        <img
          className='CloseButton'
          onClick={ () => this.props.onClose() }
          style={ !this.props.open ? { display: 'none' } : {} }
          src='https://png.icons8.com/ios/100/ffffff/delete-sign-filled.png'
        />
        <div className='TopCrops'>
          { this.listTopCrops() }
        </div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  cropData: PropTypes.array, // Array of data to display.
  open: PropTypes.bool // Determines whether the panel should be open or closed
};

export default SidePanel;

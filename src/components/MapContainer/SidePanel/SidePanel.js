import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strings from 'constants/strings.json';
import './SidePanel.css';

class SidePanel extends Component {

  listTopCrops(dataSet) {
    const crops = this.props.cropData[dataSet]

    if (crops && crops.length > 0) {
      return crops.map((crop, key) => {
        const cropName = strings[crop[0]],
          value = crop[1];

        return (
          <div style={ !this.props.open ? { display: 'none' } : {color: '#ecf0f1'} } key={ key }>
            { `${cropName}` }
          </div>);
      });
    } else {
      return (
        <div className="Unknown" style={ !this.props.open ? { display: 'none' } : {color: '#ecf0f1'} }>
          { strings.unknown }
        </div>);
    }
  }

  getHeaderClass(dataSet) {
    const crops = this.props.cropData[dataSet];

    if (crops && crops.length > 0) {
      const versus = dataSet === 'actual' ? 'predicted' : 'actual',
        versusCrops = this.props.cropData[versus];

        if (versusCrops.length === 0) {
          return 'Greater'
        } else {
          const sumCrops = crops.map(crop => crop[1]).reduce((x, y) => x + y),
            sumVersusCrop = versusCrops.map(crop => crop[1]).reduce((x, y) => x + y);

          if (sumCrops > sumVersusCrop) {
            return 'Greater';
          }
          // Don't mark cases where actual is greater than prediction in red.
          return dataSet === 'predicted' ? 'Greater' : 'Lesser';
        }
    }
    return '';
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
          <div className="PredictedList">
            <h1 className={ this.getHeaderClass('predicted') }> { strings.potential } </h1>
            { this.listTopCrops('predicted') }
          </div>

          <div className="ActualList">
            <h1 className={ this.getHeaderClass('actual') }> { strings.actual } </h1>
            { this.listTopCrops('actual') }
          </div>
        </div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  cropData: PropTypes.object, //  Arrays of data to display.
  open: PropTypes.bool // Determines whether the panel should be open or closed
};

export default SidePanel;

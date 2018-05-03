import React, { Component } from 'react';
import PropTypes from 'prop-types';
import strings from 'constants/strings.json';
import crops from 'constants/crops.json';
import './CropSelector.css';

class CropSelector extends Component {

  listAllCrops() {
    return crops.ids.map((cropId, key) => {
      const cropName = strings[cropId];
      return (
        <div
          className={ `SelectionOption ${this.props.selectedCrop === cropId ? 'Selected' : ''}` }
          onClick={ () => this.props.onSelectCrop(cropId) }
          key={ key }>
          { `${cropName}` }
        </div>);
    });
  }


  render() {
    return (
      <div className='CropSelector'
        style={ { height: this.props.open ? '92%' : '0px' } }>

        <div className='Button' onClick={ () => this.props.onClick() }>
          <h3>{ strings.visualize }</h3>
          <div className={ !this.props.open ? 'HeatMapIcon' : 'CloseIcon' }/>
        </div>

        <div className='Prompt' style={ !this.props.open ? { display: 'none' } : {} }>
          <div className='SelectCrop'>
            <h3 className='DropdownTitle'>{ strings.selectCrop }</h3>
            <div className='Dropdown'>
              { this.listAllCrops() }
            </div>
          </div>

          <div className='SelectDataset'>
            <h3 className='DropdownTitle'>{ strings.selectDataset }</h3>
            <div className='DatasetOptions'>
              <div
                className={ `SelectionOption ${this.props.selectedDataset === 'actual' ? 'Selected' : ''}` }
                onClick={ () => this.props.onSelectDataset('actual') }>
                { strings.actual }
              </div>

              <div
                className={ `SelectionOption ${this.props.selectedDataset === 'predicted' ? 'Selected' : ''}` }
                onClick={ () => this.props.onSelectDataset('predicted') }>
                { strings.potential }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CropSelector.propTypes = {
  selectedCrop: PropTypes.string, // Crop to highlight
  selectedDataset: PropTypes.string // Dataset to highlight
};

export default CropSelector;

import config from 'constants/config.json';

/*
* Util methods for making API requests.
*/

/*
* Gets the top N crops at a coordinate.
*
* @param {Object} coordinates
* @param {Number} n
* @return {Array} List of Top N Crops produced at given coordinates.
*/

export function getTopNCrops(coordinates, n) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/top_crops?x=${coordinates.lat}&y=${coordinates.lng}&n=${n}`)
      .then(response => {
        response.json().then(data => {
          resolve(data.data);
        });
      }).catch(error => reject(error));
    });
  }


/*
* Gets the top N points to produce given crop according to given dataset.
*
* @param {String} crop
* @param {Number} n
* @param {String} table - 'actual' or 'predicted'
* @return {Array} List of Top N Points.
*/

export function getTopNPoints(crop, n, table) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/top_points?crop=${crop}&n=${n}&table=${table}`)
      .then(response => {
        response.json().then(data => {
          resolve(data.data);
        });
      }).catch(error => reject(error));
    });
  }

/*
* Returns all coordinates in the map.
*
* @return {String} List of coordinate pairs.
*/

export function allCoordinates() {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/coordinates/all`)
      .then(response => {
        response.json().then(data => {
          resolve(data.data);
        });
      })
      .catch(error => reject(error));
  });
}

/*
* Returns all interesting coordinates in the map.
*
* @param {Number} n - the number of points to fetch.
* @return {String} List of coordinate pairs.
*/

export function interestinCoordinates(n) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/coordinates/interesting?n=${n}`)
      .then(response => {
        response.json().then(data => {
          resolve(data.data);
        });
      })
      .catch(error => reject(error));
  });
}


/*
* Returns the country for the given coordinates.
*
* @param {Object} coordinates
* @return {String} Name of the country.
*/

export function whichCountry(coordinates) {
  return new Promise((resolve, reject) => {
    fetch(`${config.GEOCODER_ENDPOINT}?latlng=${coordinates.lat},${coordinates.lng}&result_type=country&key=${config.API_KEY}`)
      .then(response => {
        response.json().then(data => {
          resolve(data.results[0].formatted_address);
        });
      })
      .catch(error => reject(error));
  });
}

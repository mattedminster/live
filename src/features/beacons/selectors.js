import { createSelector } from '@reduxjs/toolkit';

import { globalIdToBeaconId } from '~/model/identifiers';
import { selectionForSubset } from '~/selectors/selection';
import { selectOrdered } from '~/utils/collections';
import { getFlatEarthCoordinateTransformer } from '~/selectors/map';

import isNil from 'lodash-es/isNil';


/**
 * Selector that calculates and caches the list of all the beacons that
 * we store in the state object, in exactly the same order as they should appear
 * on the UI.
 */
export const getBeaconsInOrder = createSelector(
  (state) => state.beacons,
  selectOrdered
);

/**
 * Selector that calculates and caches the list of selected beacon IDs
 * from the state object.
 */
export const getSelectedBeaconIds = selectionForSubset(globalIdToBeaconId);


/**
 * Returns a function that can be called with a single object having `lon`,
 * `lat` and `agl` properties and that returns the corresponding coordinate
 * in the coordinate system used by the 3D view.
 */
const getGPSToThreeJSTransformation = createSelector(
  getFlatEarthCoordinateTransformer,
  (transformation) => {
    const flipY = transformation?.type !== 'nwu';
    return (coordinate) => {
      if (isNil(coordinate) || !transformation) {
        return null;
      }

      const result = transformation.fromLonLatAgl([
        coordinate.lon,
        coordinate.lat,
        coordinate.agl,
      ]);

      if (flipY) {
        // Three.JS is always right-handed but our flat Earth coordinate system
        // might be left-handed, so we have the opportunity to flip the Y axis.
        result[1] = -result[1];
      }

      return result;
    };
  }
);




/**
 * Returns the current beacon positions.
 *
 * @param  {Object}  state  the state of the application
 */
export const getBeaconGPSPositions = createSelector(
     (state) => state.beacons,
     (beacons) => {
      const result = [];

      for (const [key, value] of Object.entries(beacons.byId)) {
        if (value.position != null){
        const coordinate = {lon: value.position.lon, lat: value.position.lat, agl: value.position.agl};
        result.push(coordinate);
        }
      }

      return result;
    },
   
  );


export const getBeaconAttitude = createSelector(
    (state) => state.beacons,
    (beacons) => {
     const result = [];

     for (const [key, value] of Object.entries(beacons.byId)) {
       const attitude = value.attitude;
       return attitude;
       
     }

     return result;
   },
  
 );

 export const getBeaconName = createSelector(
  (state) => state.beacons,
  (beacons) => {


   for (const [key, value] of Object.entries(beacons.byId)) {
    //console.log(value.name)
     const name = value.name;
     return name;
     
   }

    return null;
 },

);




export const getBeaconForThreeDView = createSelector(
    getBeaconGPSPositions,
    getGPSToThreeJSTransformation,
    (beaconPositions, transformation) => beaconPositions.map(transformation)
  );

/**
 * Funciton that returns the name of the given beacon that should be shown to
 * the user on the UI.
 */
export const getBeaconDisplayName = (beacon) =>
  (beacon ? beacon.name || beacon.id : null) || 'Unnamed beacon';

/**
 * Selector that returns the IDs of all the beacons that have no basic
 * information fetched from the server yet.
 */
export const getBeaconIdsWithoutBasicInformation = createSelector(
  (state) => state.beacons,
  (beacons) => {
    const result = [];

    for (const [key, value] of Object.entries(beacons.byId)) {
      if (typeof value.name === 'undefined') {
        result.push(key);
      }
    }

    return result;
  }
);

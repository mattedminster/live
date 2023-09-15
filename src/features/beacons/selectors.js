import { createSelector } from '@reduxjs/toolkit';

import { globalIdToBeaconId } from '~/model/identifiers';
import { selectionForSubset } from '~/selectors/selection';
import { selectOrdered } from '~/utils/collections';
import { getFlatEarthCoordinateTransformer } from '~/selectors/map';
import sum from 'lodash-es/sum';

import {
  getActiveUAVIds,
} from '~/features/uavs/selectors';

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
export const getGPSToThreeJSTransformation = createSelector(
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
        coordinate.amsl,
      ]);
      console.log("GPS to threejs result: " + result)

      if (flipY) {
        console.log("flipping Y");
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
        try{
          if (value.position != null){
          //console.log("value.position: " + value.position.lat + " " + value.position.lon + " " + value.position.amsl);
          const coordinate = {lon: value.position.lon, lat: value.position.lat, amsl: value.position.amsl};
          result.push(coordinate);
          }else{
            const coordinate = {lon: 0, lat: 0, amsl: 0};
            result.push(coordinate);
          }
        }catch(err){
          console.log("error in getBeaconGPSPositions: " + err);
          const coordinate = {lon: 0, lat: 0, amsl: 0};
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
       //console.log(value.attitude);
       const attitude = value.attitude;
       result.push(attitude);
     }

     return result;
   },
  
 );

 export const getAvgAltitude = createSelector(
  (state) => state.uavs, (uavs) => {

    //console.log("Number of objects in uavs.byId: " + Object.keys(uavs.byId).length);
    //hardcoding for now so once we start using more than 125 drones we will need to fix..
    const altitudes = [];
    for (const [uav, data] of Object.entries(uavs.byId)) {
      
      const intUav = parseInt(uav);
      if (intUav > 125) {
        altitudes.push(data.position.amsl);
      }
      
    }

    if (altitudes.length > 0) {
      const avgAltitude = sum(altitudes) / altitudes.length;
      return avgAltitude;
    }
    return 0;


  });

 export const getBeaconName = createSelector(
  (state) => state.beacons,
  (beacons) => {
    const result = [];
    


   for (const [key, value] of Object.entries(beacons.byId)) {
    //console.log("querying name: " + value.name)
     const name = value.name;
     result.push(name); 
   }

    return result;
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

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Presentational component that renders a set of beacons in the scene at the
 * given Three.JS coordinates.
 */
const ShootLines = ({ coordinates, mixin, rotation, name }) =>
  coordinates.map((coordinate, index) => {
    const key = `${mixin}-${index}`;
    console.log("rotation: " + rotation);

    let rot = [0,0,0]
    if (name != null){
      if (name.includes("Player")){
        if (rotation != null){
          var rotZ = rotation[2] + 225;
          //console.log("rotZ: " + rotZ);
          rot = [rotation[0], rotation[1], rotZ];
          //console.log(rot);
        }
        return (
          coordinate && (
            <a-entity key={key} mixin={mixin} position={coordinate.join(' ')} rotation={rot.join(' ')} />
          )
        );
      }
      else{
        return (
          null
        );
      }
    }
    
  });

ShootLines.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  mixin: PropTypes.string,
};

export default ShootLines;

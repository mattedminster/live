import PropTypes from 'prop-types';
import React from 'react';

/**
 * Presentational component that renders a set of beacons in the scene at the
 * given Three.JS coordinates.
 */
const Beacons = ({ coordinates, mixin, rotation }) =>
  coordinates.map((coordinate, index) => {
    const key = `${mixin}-${index}`;
    let rot = [0,0,0]
    //console.log("rotation:"+ rotation)
    if (rotation != null){
      rot = [rotation[0], rotation[1], rotation[2]];
    }
    return (
      coordinate && (
        <a-entity key={key} mixin={mixin} position={coordinate.join(' ')} rotation={rot.join(' ')} />
      )
    );
  });

Beacons.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  mixin: PropTypes.string,
};

export default Beacons;

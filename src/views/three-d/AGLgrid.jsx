import { eu } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React from 'react';
import * as THREE from 'three';
import { setCameraPose } from '~/features/three-d/slice';

import Colors from '~/components/colors';

import { objectToString } from '~/aframe/utils';

import { skybrushToThreeJsPosition } from '@skybrush/aframe-components/lib/spatial';

const grounds = {
  /* Minecraft-style ground texture (green) */
  default: {
    groundColor: '#8eb971',
    groundColor2: '#507a32',
    groundTexture: 'walkernoise',
    groundYScale: 24,
    /* make the "play area" larger so we have more space to fly around without
     * bumping into hills */
    playArea: 1.6,
  },
  rl_default: {
    groundColor: '#8eb971',
    groundColor2: '#507a32',
    groundTexture: 'walkernoise',
    groundYScale: 24,
    /* make the "play area" larger so we have more space to fly around without
     * bumping into hills */
    playArea: 3.6,
  },
  /* Checkerboard indoor texture */
  indoor: {
    ground: 'flat',
    groundColor: '#333',
    groundColor2: '#666',
    groundTexture: 'checkerboard',
  },
  indoorRL: {
    ground: 'flat',
    groundColor: '#7CB68E',
    groundColor2: '#666',
    groundTexture: 'checkerboard',
    playArea: 1.6,
  },
};

const environments = {
  'outdoor-light': {
    preset: 'default',
    fog: 0.2,
    gridColor: '#fff',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  'outdoor-dark': {
    preset: 'starry',
    fog: 0.2,
    gridColor: '#39d2f2',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  'indoor-light': {
    preset: 'default',
    fog: 0.2,
    gridColor: '#fff',
    skyType: 'gradient',
    skyColor: '#eceff1',
    horizonColor: '#fed',
    ...grounds.indoor,
  },
  'indoor-dark': {
    preset: 'default',
    fog: 0.2,
    gridColor: '#888',
    skyType: 'gradient',
    skyColor: '#000',
    horizonColor: '#222',
    ...grounds.indoor,
  },
  'indoor-rl': {
    preset: 'default',
    fog: 0,
    gridColor: '#0000ff',
    skyType: 'gradient',
    skyColor: '#000',
    horizonColor: '#222',
    ...grounds.indoorRL,
  },
  'outdoor-rl': {
    preset: 'default',
    fog: 0.2,
    gridColor: '#fff',
    skyType: 'atmosphere',
    skyColor: '#88c',
    ...grounds.default,
  },
  'outdoor-rl-standout': {
    fog: 0.2,
    gridColor: '#39d2f2',
    ...grounds.default,
  },
  'outdoor-rl-dark': {
    preset: 'starry',
    fog: 0.0,
    gridColor: '#39d2f2',
    skyType: 'atmosphere',
    ...grounds.rl_default,
  },
};

import { useState, useEffect } from 'react';

const AGLgrid = ({ coordinates, mixin, rotation, name, altitude, cameraView }) => {
  // State to track if the position has been calculated
  const [positionCalculated, setPositionCalculated] = useState(false);

  // State to store the position based on the first average altitude
  const [position, setPosition] = useState([0, 0, 0]);

  useEffect(() => {
    if (!positionCalculated && coordinates.length > 0) {
      // Calculate the first average altitude
      const firstAverageAltitude = altitude;

      const scale = 0.5;

      // Set the position using the first average altitude
      const pos = [0, 0, firstAverageAltitude];

      // Update the position and set positionCalculated to true
      setPosition(pos);
      setPositionCalculated(true);
    }
  }, [coordinates, positionCalculated]);

  if (positionCalculated) {
    return (
      <a-entity
        key="agl-grid"
        position={position.join(' ')}
        rotation="90 0 0"
        scale={`0.5 0.5 0.5`}
      >
        {/* Move the floor slightly down to ensure that the coordinate axes are nicely visible */}
        <a-entity
          key="outdoor-rl-ent"
          environment={objectToString({
            ...(environments['outdoor-rl-dark']),
          })}
        />
      </a-entity>
    );
  } else {
    return null; // Return null until the position is calculated
  }
};


AGLgrid.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  mixin: PropTypes.string,
};

export default AGLgrid;

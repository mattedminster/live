import { eu } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React from 'react';
import * as THREE from 'three';

import Colors from '~/components/colors';



function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function rotationMatrix(roll, pitch, yaw) {
  const r = toRadians(roll);
  const p = toRadians(pitch);
  const y = toRadians(yaw);

  const Rx = [
    [1, 0, 0],
    [0, Math.cos(r), -Math.sin(r)],
    [0, Math.sin(r), Math.cos(r)]
  ];

  const Ry = [
    [Math.cos(p), 0, Math.sin(p)],
    [0, 1, 0],
    [-Math.sin(p), 0, Math.cos(p)]
  ];

  const Rz = [
    [Math.cos(y), -Math.sin(y), 0],
    [Math.sin(y), Math.cos(y), 0],
    [0, 0, 1]
  ];

  const R = multiplyMatrices(Rz, multiplyMatrices(Ry, Rx));
  return R;
}

function multiplyMatrices(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;
  const result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));

  if (colsA !== rowsB) {
    throw new Error('Number of A columns must match number of B rows.');
  }

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function nedToNwu(roll, pitch, yaw) {
  const R_ned = rotationMatrix(roll, pitch, yaw);

  const T = [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ];

  const R_nwu = multiplyMatrices(T, R_ned);

  // Extract roll, pitch, and yaw angles from the R_nwu matrix
  const nwuRoll = Math.atan2(R_nwu[2][1], R_nwu[2][2]);
  const nwuPitch = Math.asin(-R_nwu[2][0]);
  const nwuYaw = Math.atan2(R_nwu[1][0], R_nwu[0][0]);

  // Convert angles from radians to degrees
  const nwuRollDeg = nwuRoll * 180 / Math.PI;
  const nwuPitchDeg = nwuPitch * 180 / Math.PI;
  const nwuYawDeg = nwuYaw * 180 / Math.PI;

  return [nwuRollDeg, nwuPitchDeg, nwuYawDeg];
}


function nedToNwuEuler(roll, pitch, yaw) {
  const rollNwu = -roll;
  const pitchNwu = -pitch;
  const yawNwu = -(yaw - 180);

  return { roll: rollNwu, pitch: pitchNwu, yaw: yawNwu };
}

function eulerToQuaternion(roll, pitch, yaw) {
  const euler = new THREE.Euler(THREE.MathUtils.degToRad(yaw), THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(roll), 'ZYX');
  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(euler);
  return quaternion;
}

function quaternionToEuler(quaternion) {
  const euler = new THREE.Euler();
  euler.setFromQuaternion(quaternion, 'ZYX');
  return {
    roll: THREE.MathUtils.radToDeg(euler.z),
    pitch: THREE.MathUtils.radToDeg(euler.y),
    yaw: THREE.MathUtils.radToDeg(euler.x),
  };
}


/**
 * Presentational component that renders a set of beacons in the scene at the
 * given Three.JS coordinates.
 */
const ShootLines = ({ coordinates, mixin, rotation, name }) =>
  coordinates.map((coordinate, index) => {
    const mixin_x = `${mixin}-x`;
    const mixin_y = `${mixin}-y`;
    const mixin_z = `${mixin}-z`;

    const key_x = `${mixin_x}-${index}`;
    const key_y = `${mixin_y}-${index}`;
    const key_z = `${mixin_z}-${index}`;
    
    //console.log("roll: " + Math.round(rotation[0]) + " |  pitch: " + Math.round(rotation[1]) + " | yaw: " + Math.round(rotation[2]));
    //console.log("key: " + key + " |  name: " + name);
    
    //console.log("key_x: " + key_x + " |  name: " + name);
    //console.log("key_y: " + key_y + " |  name: " + name);
    let x_rot = [0,0,0];
    let y_rot = [0,0,0];
    let z_rot = [0,0,0];
    var roll = rotation[0];
    var pitch = rotation[1];
    var yaw = rotation[2];

    const { roll: rollNwu, pitch: pitchNwu, yaw: yawNwu } = nedToNwuEuler(roll, pitch, yaw);

   
    //const [nwuRoll, nwuPitch, nwuYaw] = nedToNwu(roll, pitch, yaw);
    //console.log("roll: " + Math.round(nwuRoll) + " |  pitch: " + Math.round(nwuPitch) + " | yaw: " + Math.round(nwuYaw));

    //negative yaw looks good! pitch is still very weird lets not worry about roll for now
    // x_rot = [nwuRoll, nwuPitch, nwuYaw];
    x_rot = [-roll, pitch, -yaw];
    // y_rot = [nwuRoll, nwuPitch, nwuYaw];
    // z_rot = [nwuRoll, nwuPitch, nwuYaw];
    console.log("x_rot: " + x_rot + " |  y_rot: " + y_rot + " | z_rot: " + z_rot);




      return (
      // <a-entity
      // meshline={`lineWidth: 5; path: 0 0 0, 50 0 0; color: ${Colors.axes.x}`} />
      // <a-entity obj-model="obj: #gun-obj; mtl: #gun-mtl" position="0 1 -5" rotation="0 0 0" scale="1 1 1"></a-entity>
      
      coordinate && (
        <>
        <a-entity obj-model="obj: #gun-obj;" position={coordinate.join(' ')} rotation={x_rot.join(' ')} />
        <a-entity key={key_x} mixin={mixin_x} position={coordinate.join(' ')} rotation={x_rot.join(' ')} />
      </>)
  // 
      // coordinate && (
      //   <>
      //   <a-entity key={key_x} mixin={mixin_x} position={coordinate.join(' ')} rotation={x_rot.join(' ')} />
      //   <a-entity key={key_y} mixin={mixin_y} position={coordinate.join(' ')} rotation={y_rot.join(' ')} />
      //   <a-entity key={key_z} mixin={mixin_z} position={coordinate.join(' ')} rotation={z_rot.join(' ')} />
      // </>)
      );
      
        // if (rotation != null){
        //   //A-Frame uses a right-handed coordinate system. When aligning our right hand’s thumb with a positive axis, our hand will curl in the positive direction of rotation.
        //   var roll = rotation[0];
        //   var pitch = rotation[1];
        //   var yaw = rotation[2];

        //   //rot = [pitch, yaw, roll];
        //   rot = [pitch, roll, yaw];
        //   //console.log(rot);
        // }
        // return (
        //   coordinate && (
        //     <a-entity key={key} mixin={mixin} position={coordinate.join(' ')} rotation={rot.join(' ')} />
        //   )
        // );
    
    
    
  });

ShootLines.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  mixin: PropTypes.string,
};

export default ShootLines;

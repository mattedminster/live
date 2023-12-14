import { eu } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React from 'react';
import * as THREE from 'three';
import { setCameraPose } from '~/features/three-d/slice';
import Colors from '~/components/colors';

// Function to convert rotation matrix to roll, pitch, yaw angles (in radians)
function rotationMatrixToRPY(R) {
  const pitch = Math.asin(-R[2][0]);
  const roll = Math.atan2(R[2][1], R[2][2]);
  const yaw = Math.atan2(R[1][0], R[0][0]);
  return [roll, pitch, yaw];
}

// Function to convert roll, pitch, yaw angles to rotation matrix
function rpyToRotationMatrix(roll, pitch, yaw) {
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);

  const R = [
    [cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr],
    [sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr],
    [-sp, cp * sr, cp * cr]
  ];
  return R;
}

// Function to ca

// Function to convert radians to degrees
function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

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



/**
 * Presentational component that renders a set of beacons in the scene at the
 * given Three.JS coordinates.
 */
const ShootLines = ({ coordinates, mixin, rotation, name, cameraView }) =>

coordinates.map((coordinate, index) => {
  //console.log("coordinates: " + coordinates + " rotation: " + rotation + " name: " + name);  
    var player_name = name[index];
    var player_rotation = rotation[index];
    
    // console.log("player_rotation: " + player_rotation);
    // console.log("player cord: " + coordinate);
    if (player_name != null) {
      if(rotation != null && player_name.includes("Player")){
        const mixin_x = `${mixin}-x`;
        const mixin_y = `${mixin}-y`;
        const mixin_z = `${mixin}-z`;

        var key_x = `${mixin_x}-${index}`;
        var key_y = `${mixin_y}-${index}`;
        var key_z = `${mixin_z}-${index}`;
        var gun_color_mix = '';
        if (player_name.includes("1")){
          gun_color_mix = 'obj: #gun-obj; mtl: #gun-mtl-red;'
          key_x = `${mixin_x}-${index}-red`;
          key_y = `${mixin_y}-${index}-red`;
        }else if (player_name.includes("2")){
          gun_color_mix = 'obj: #gun-obj; mtl: #gun-mtl-green;';
          key_x = `${mixin_x}-${index}-green`;
          key_y = `${mixin_y}-${index}-green`;
        }else if (player_name.includes("3")){
          gun_color_mix = 'obj: #gun-obj; mtl: #gun-mtl-blue;'
          key_x = `${mixin_x}-${index}-blue`;
          key_y = `${mixin_y}-${index}-blue`;
        };

        
        let x_rot = [0,0,0];
        var roll = player_rotation[0];
        var pitch = player_rotation[1];
        var yaw = player_rotation[2];

        // Create a new object3D (this could be a Mesh, Group, etc.)
        const object3D = new THREE.Object3D();

        // Convert roll, pitch, and yaw to a quaternion
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(toRadians(pitch), toRadians(yaw), toRadians(roll), 'ZYX'));

      // Set the object's initial quaternion
        object3D.quaternion.copy(quaternion);

        // Create a rotation matrix for a 180-degree rotation around the x-axis
        const rotationMatrix = new THREE.Matrix4();
        // pitch, yaw, roll
        //var rot_matrix = new THREE.Euler(toRadians(0), toRadians(0), toRadians(180), 'ZYX'); beofre matt messed with it ;)
        var rot_matrix = new THREE.Euler(toRadians(0), toRadians(0), toRadians(180), 'ZYX');
        rotationMatrix.makeRotationFromEuler(rot_matrix);

        // Apply the rotation matrix to the object's quaternion
        object3D.applyMatrix4(rotationMatrix);

        // The object's quaternion is now updated to represent the new orientation
        //console.log(object3D.quaternion);

        // Convert the updated quaternion to Euler angles (roll, pitch, yaw)
        const updatedEuler = new THREE.Euler();
        updatedEuler.setFromQuaternion(object3D.quaternion, 'ZXY');

        // Extract the roll, pitch, and yaw angles in radians
        const updatedRoll = updatedEuler.z;
        const updatedPitch = updatedEuler.x;
        const updatedYaw = updatedEuler.y;

        // Optionally, convert the angles to degrees
        const updatedRollDeg = updatedRoll * (180 / Math.PI);
        const updatedPitchDeg = updatedPitch * (180 / Math.PI);
        const updatedYawDeg = updatedYaw * (180 / Math.PI);

        x_rot = [updatedRollDeg, -updatedPitchDeg, updatedYawDeg]
        let shootLine = [coordinate[0], coordinate[1], coordinate[2]+.1];
        if (player_name != null && coordinate[2] > 0) {
          if (player_name.includes(cameraView)) {
            //console.log("player_name: " + player_name);
            //console.log("position: " + coordinate[2]);
            //z is x, y is z
            const cameraObj = document.querySelector('a-camera');
            cameraObj.setAttribute('position', { x: -coordinate[1], y: coordinate[2]+.15, z: -coordinate[0] }); 
            //cameraObj.setAttribute('rotation', { x: -x_rot[1], y: -x_rot[2], z: (180 - x_rot[0]) }); 
            //console.log("x_rot: " + x_rot);
            let x_rotation = -x_rot[1];
            let y_rotation = -x_rot[2];
            let z_rotation = 0; //roll which is x_rot[0]
            cameraObj.setAttribute('rotation', { x: x_rotation, y: y_rotation, z: z_rotation }); 
            //cameraObj.setAttribute('rotation', { x:  x_rot[1], y: -x_rot[2], z: 0}); //og
            
          };
        };

          return (
          coordinate && (
            <>
            <a-entity key={key_y} obj-model={gun_color_mix} position={coordinate.join(' ')} rotation={x_rot.join(' ')} />
            <a-entity key={key_x} mixin={mixin_x} position={shootLine.join(' ')} rotation={x_rot.join(' ')} />
         
          </>)
          );
        
      }
    }
  });

ShootLines.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  mixin: PropTypes.string,
};

export default ShootLines;

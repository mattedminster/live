import { take } from 'redux-saga/effects';

import { skybrushToThreeJsPosition } from '@skybrush/aframe-components/lib/spatial';

import { cameraRef, getSceneDOMNode } from './refs';
import { resetZoom, rotateViewTowards } from './slice';

import {getBeaconAttitude, getBeaconName, getBeaconForThreeDView} from '~/features/beacons/selectors';


/**
 * Saga that listens for camera-related actions dispatched from the store and
 * animates the 3D view appropriately.
 */
export default function* cameraAnimatorSaga() {
  const RESET_ZOOM = resetZoom.toString();
  const ROTATE_VIEW_TOWARDS = rotateViewTowards.toString();

  while (true) {
    const action = yield take([RESET_ZOOM, ROTATE_VIEW_TOWARDS]);
    const controller = getCameraController();
 
    //console.log("action:" + action);
    //console.log("action payload", action.payload);

    if (controller) {
      switch (action.type) {
        case RESET_ZOOM:
          controller.resetZoom();
          setFocusOnScene();
          break;

        case ROTATE_VIEW_TOWARDS:
          handleViewRotationTowards(controller, action.payload);
          
          setFocusOnScene();
          break;

        default:
          break;
      }
    }
  }
}

/**
 * Finds the AFrame camera controller component in the entity referenced by the
 * cameraRef.
 */
function getCameraController() {
  if (cameraRef.current) {
    const components = cameraRef.current.components;
    return components ? components['advanced-camera-controls'] : null;
  }

  return null;
}

function handleViewRotationTowards(controller, point) {
  //split them up 
  const target_point = point.slice(0, 3);
  const target_position = point.slice(-3);
  
  //console.log("target_point: ", target_point);
  //console.log("target_postion: ", target_position);

  const target = { lookAt: skybrushToThreeJsPosition(target_point) };
  
  const cameraObj = document.querySelector('a-camera');
  //instead of going birds eye lets shift the camera to the posistion of the rtk system
  //const zTarget = point[2] + 15;
  if (target_position[2] < 1){
    cameraObj.setAttribute('position', { x: -target_position[1], y: target_position[2], z: -target_position[0] }); 
  }
  
  controller.startTransitionTo(target);
}

/**
 * Sets the focus to the scene containing the camera that the saga is controlling.
 */
function setFocusOnScene() {
  const scene = getSceneDOMNode();
  if (scene && scene.focus) {
    scene.focus();
  }
}

import AFrame from '~/aframe/aframe';
import { showError } from '~/features/snackbar/actions';
import { getActiveUAVIds } from '~/features/uavs/selectors';

import {getBeaconGPSPositions, getBeaconForThreeDView, getBeaconsInOrder, getGPSToThreeJSTransformation} from '~/features/beacons/selectors';

import { getDroneFlockDOMNode } from './refs';
import { rotateViewTowards } from './slice';

export { resetZoom } from './slice';



const { THREE } = AFrame;

export const rotateViewToDrones = () => (dispatch, getState) => {
  const state = getState();
  const activeUAVIds = getActiveUAVIds(state);
  if (activeUAVIds.length === 0) {
    dispatch(showError('No active UAVs to focus the view on.'));
    return;
  }

  const flockDOMNode = getDroneFlockDOMNode();
  const flockComponent = flockDOMNode?.components['drone-flock'];
  if (!flockComponent) {
    console.warn(
      'No drone flock component is mounted in the DOM; this is probably a bug.'
    );
    return;
  }

  const center = new THREE.Vector3();
  const position = new THREE.Vector3();
  let numberOfVisibleEntities = 0;
  for (const uavId of activeUAVIds) {
    const entity = flockComponent.getEntityForUAVById(uavId);
    const position = entity?.getAttribute('position');
    if (position) {
      center.add(position);
      numberOfVisibleEntities += 1;
    }
  }

  //const beacons = getBeaconGPSPositions(state);
  const beacon_positions = getBeaconForThreeDView(state);
  const beacons = getBeaconsInOrder(state);
  var rtk_position = null;

  for (const [index, beacon] of beacons.entries()) {
    console.log("beacon!!", beacon);
    
    if (beacon.id.includes("rtk")){

      rtk_position = beacon_positions[index];

    }
    
  }

  console.log("number of visible entities ", numberOfVisibleEntities);
  if (numberOfVisibleEntities > 0) {
    center.divideScalar(numberOfVisibleEntities);

    //hard code some mods that work good for us
    center.x = center.x + 0;
    center.y = center.y + 0;
    center.z = center.z;

    let response = center.toArray();
    console.log("rtk_position", rtk_position);
    if (rtk_position == null){
      console.log("not rtk found using default birds eye view")
      response.push(center.x);
      response.push(center.y);
      response.push(center.z + 15);
    }else{
      response.push(rtk_position[0]);
      response.push(rtk_position[1]);
      response.push(rtk_position[2]);
    }
    
    dispatch(rotateViewTowards(response));
  }else{
      console.log("no visible entities were hardcoding!")
      //hard code some mods that work good for us
      let response = center.toArray();
      center.x = 0;
      center.y = 0;
      center.z = 100;
      response.push(center.x);
      response.push(center.y);
      response.push(center.z + 15);
      dispatch(rotateViewTowards(response));

  }
  
};

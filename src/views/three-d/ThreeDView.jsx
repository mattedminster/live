/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import CoordinateSystemAxes from './CoordinateSystemAxes';
import HomePositionMarkers from './HomePositionMarkers';
import ShootLineMarkers from './ShootLineMarkers';
import AGLgridMarker from './AGLgridMarker';
import BeaconPositionMarkers from './BeaconPositionMarkers';
import LandingPositionMarkers from './LandingPositionMarkers';
import Room from './Room';
import Scenery from './Scenery';
import SelectedTrajectories from './SelectedTrajectories';

// eslint-disable-next-line no-unused-vars
import AFrame from '~/aframe';
import { objectToString } from '~/aframe/utils';
import Colors from '~/components/colors';
import {
  getLightingConditionsForThreeDView,
  getSceneryForThreeDView,
} from '~/features/settings/selectors';
import { isShowIndoor } from '~/features/show/selectors';
import { isMapCoordinateSystemLeftHanded } from '~/selectors/map';

import glowImage from '~/../assets/img/sphere-glow-hollow.png';
import obj from '~/../assets/models/rl_shotgun_ned.obj';
import mtl from '~/../assets/models/shotgun.mtl';
const images = {
  glow: glowImage,
};

/**
 * Selector that returns the "effective' scenery to use in the 3D view,
 * potentially based on whether the show is indoor or outdoor.
 */
const getEffectiveScenery = (state) => {
  const scenery = getSceneryForThreeDView(state);
  if (scenery === 'auto') {
    if (isShowIndoor(state)) {
      return 'indoor';
    } else {
      return 'outdoor';
    }
  } else {
    return scenery;
  }
};

const ThreeDView = React.forwardRef((props, ref) => {
  const {
    cameraRef,
    grid,
    isCoordinateSystemLeftHanded,
    lighting,
    navigation,
    sceneId,
    scenery,
    showAxes,
    showBeaconPositions,
    showAGLgrid,
    showShootLines,
    showHomePositions,
    showLandingPositions,
    showStatistics,
    showTrajectoriesOfSelection,
  } = props;

  const extraCameraProps = {
    'advanced-camera-controls': objectToString({
      acceptsKeyboardEvent: 'notEditable',
      embedded: true,
      fly: navigation && navigation.mode === 'fly',
      minAltitude: 0.5,
      reverseMouseDrag: true,
    }),
    'look-controls': objectToString({
      enabled: false,
    }),
    'wasd-controls': objectToString({
      enabled: false,
    }),
  };
  const extraSceneProps = {};

  if (showStatistics) {
    extraSceneProps.stats = 'true';
  }

  return (
    <a-scene
      key={sceneId}
      ref={ref}
      deallocate
      embedded='true'
      keyboard-shortcuts='enterVR: false'
      loading-screen='backgroundColor: #424242; dotsColor: #888'
      renderer='antialias: false'
      vr-mode-ui='enabled: false'
      device-orientation-permission-ui='enabled: false'
      tabIndex={-1}
      class='react-hotkeys-ignore'
      {...extraSceneProps}
    >
      <a-assets>
      <a-asset-item id="gun-obj" src="~/../assets/models/rl_shotgun_ned.obj"></a-asset-item>
      <a-asset-item id="gun-mtl" src="~/../assets/models/shotgun.mtl"></a-asset-item>
      

        <img crossOrigin='anonymous' id='glow-texture' src={images.glow} />
        <a-mixin
          id='takeoff-marker'
          geometry='primitive: triangle; vertexA: 1 0 0; vertexB: -0.5 0.866 0; vertexC: -0.5 -0.866 0'
          material={`color: ${Colors.markers.takeoff}; shader: flat; side: double`}
        />
        <a-mixin
          id='beacon-marker'
          geometry='primitive: triangle; vertexA: -2 0 0; vertexB: 0.5 .866 0; vertexC: .5 -0.866 0' 
          material={`color: purple; shader: flat; side: double`}
        />
        <a-mixin
          id='landing-marker'
          geometry='primitive: triangle; vertexA: -1 0 0; vertexB: 0.5 -0.866 0; vertexC: 0.5 0.866 0'
          material={`color: ${Colors.markers.landing}; shader: flat; side: double`}
        />
        <a-mixin
          id="shoot-line-x"
          meshline={`lineWidth: 5; path: 0 0 0, 50 0 0; color: red;`}
          // geometry="primitive: cylinder; height: 50; radius: 0.1; thetaStart: 0; thetaLength: 180"
          // material="color: red"
        />
        <a-mixin
          id="shoot-line-y"
          meshline={`lineWidth: 5; path: 0 0 0, 0 50 0; color: green;`}
        />
        <a-mixin
          id="shoot-line-z"
          meshline={`lineWidth: 5; path: 0 0 0, 0 0 50; color: blue;`}
        />
      </a-assets>

      <a-camera
        ref={cameraRef}
        sync-pose-with-store=''
        id='three-d-camera'
        {...extraCameraProps}
      >
        <a-entity
          cursor='rayOrigin: mouse'
          raycaster='objects: .three-d-clickable; interval: 100'
        />
      </a-camera>

      <a-entity rotation='-90 0 90'>
        {showAxes && (
          <CoordinateSystemAxes
            leftHanded={isCoordinateSystemLeftHanded}
            length={10}
            lineWidth={10}
          />
        )}
        {showShootLines && <ShootLineMarkers />}
        {showAGLgrid && <AGLgridMarker />}
        {showBeaconPositions && <BeaconPositionMarkers />}
        {showHomePositions && <HomePositionMarkers />}
        {showLandingPositions && <LandingPositionMarkers />}
        {showTrajectoriesOfSelection && <SelectedTrajectories />}

        <a-drone-flock />

        <Room />
      </a-entity>
      

      <Scenery type={`${scenery}-${lighting}`} grid={grid} />
    </a-scene>
  );
});

ThreeDView.propTypes = {
  cameraRef: PropTypes.any,
  grid: PropTypes.string,
  isCoordinateSystemLeftHanded: PropTypes.bool,
  lighting: PropTypes.oneOf(['dark', 'light']),
  cameraView: PropTypes.oneOf(['birdseye', '1']),
  navigation: PropTypes.shape({
    mode: PropTypes.oneOf(['walk', 'fly']),
    parameters: PropTypes.object,
  }),
  sceneId: PropTypes.number,
  scenery: PropTypes.oneOf(['outdoor', 'indoor']),
  showAxes: PropTypes.bool,
  showHomePositions: PropTypes.bool,
  showShootLines: PropTypes.bool,
  showAGLgrid: PropTypes.bool,
  showBeaconPositions: PropTypes.bool,
  showLandingPositions: PropTypes.bool,
  showStatistics: PropTypes.bool,
  showTrajectoriesOfSelection: PropTypes.bool,
};

export default connect(
  // mapStateToProps
  (state) => ({
    isCoordinateSystemLeftHanded: isMapCoordinateSystemLeftHanded(state),
    ...state.settings.threeD,
    ...state.threeD,
    scenery: getEffectiveScenery(state),
    lighting: getLightingConditionsForThreeDView(state),
  }),
  // mapDispatchToProps
  {},
  // mergeProps
  null,
  { forwardRef: true }
)(ThreeDView);

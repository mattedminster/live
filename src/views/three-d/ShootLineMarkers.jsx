import { connect } from 'react-redux';

//import { getHomePositionsInMissionForThreeDView } from '~/features/three-d/selectors';
import {getBeaconAttitude, getBeaconName, getBeaconForThreeDView} from '~/features/beacons/selectors';

import ShootLines from './ShootLines';

export default connect(
  // mapStateToProps
  (state) => ({
   
    coordinates: getBeaconForThreeDView(state),
    mixin: 'shoot-line',
    rotation: getBeaconAttitude(state),
    name: getBeaconName(state),
    cameraView: state.threeD.cameraView,
  }),
  // mapDispatchToProps
  {}
)(ShootLines);

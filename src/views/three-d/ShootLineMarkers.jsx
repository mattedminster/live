import { connect } from 'react-redux';

//import { getHomePositionsInMissionForThreeDView } from '~/features/three-d/selectors';
import {getBeaconAttitude, getBeaconForThreeDView} from '~/features/beacons/selectors';

import ShootLines from './ShootLines';

export default connect(
  // mapStateToProps
  (state) => ({
   
    coordinates: getBeaconForThreeDView(state),
    mixin: 'shoot-line',
    rotation: getBeaconAttitude(state),
  }),
  // mapDispatchToProps
  {}
)(ShootLines);

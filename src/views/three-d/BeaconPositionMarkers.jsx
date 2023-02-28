import { connect } from 'react-redux';

//import { getHomePositionsInMissionForThreeDView } from '~/features/three-d/selectors';
import {getBeaconAttitude, getBeaconForThreeDView} from '~/features/beacons/selectors';

import Beacons from './Beacons';

export default connect(
  // mapStateToProps
  (state) => ({
   
    coordinates: getBeaconForThreeDView(state),
    mixin: 'beacon-marker',
    rotation: getBeaconAttitude(state),
  }),
  // mapDispatchToProps
  {}
)(Beacons);

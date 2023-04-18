import { connect } from 'react-redux';

//import { getHomePositionsInMissionForThreeDView } from '~/features/three-d/selectors';
import {getBeaconAttitude, getBeaconName, getBeaconForThreeDView} from '~/features/beacons/selectors';

import AGLgrid from './AGLgrid';

export default connect(
  // mapStateToProps
  (state) => ({
   
    coordinates: getBeaconForThreeDView(state),
    mixin: 'shoot-line',
    rotation: getBeaconAttitude(state),
    name: getBeaconName(state),
  }),
  // mapDispatchToProps
  {}
)(AGLgrid);

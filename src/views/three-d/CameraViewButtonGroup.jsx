import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CenterFocusStrong from '@material-ui/icons/CenterFocusStrong';
import ZoomOut from '@material-ui/icons/ZoomOut';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import ToolbarDivider from '~/components/ToolbarDivider';
import ToggleButton from '~/components/ToggleButton';

/**
 * Button group that allows the user to select the navigation mode currently
 * used in the 3D view.
 */
const CameraViewButtonGroup = ({
  cameraView,
  onChange,
}) => (
  <>
   
    <ToolbarDivider orientation='vertical' />
    <ToggleButtonGroup size='small'>
    <ToggleButton
        selected={cameraView === 'birdseye'}
        value='birdseye'
        onClick={() => onChange('birdseye')}
      >
        Explore
      </ToggleButton>
      <ToggleButton
        selected={cameraView === '1'}
        value='1'
        onClick={() => onChange('1')}
      >
        1
      </ToggleButton>
      <ToggleButton
        selected={cameraView === '2'}
        value='2'
        onClick={() => onChange('2')}
      >
        2
      </ToggleButton>
      <ToggleButton
        selected={cameraView === '3'}
        value='3'
        onClick={() => onChange('3')}
      >
        3
      </ToggleButton>
    </ToggleButtonGroup>
  </>
);

CameraViewButtonGroup.propTypes = {
  cameraView: PropTypes.oneOf(['birdseye', '1', '2', '3']),
  onChange: PropTypes.func,

};

export default CameraViewButtonGroup;

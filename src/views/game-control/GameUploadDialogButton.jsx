import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';

import StatusLight from '@skybrush/mui-components/lib/StatusLight';

import ListItemTextWithProgress from '~/components/ListItemTextWithProgress';
import { Status } from '~/components/semantics';
import { SHOW_UPLOAD_JOB } from '~/features/show/constants';
import { getSetupStageStatuses } from '~/features/show/stages';
import {
  getUploadProgress,
  isUploadInProgress,
} from '~/features/upload/selectors';
import { openUploadDialogForJob } from '~/features/upload/slice';
import UploadProgressBar from '~/features/upload/UploadProgressBar';

/**
 * React component for the button that allows the user to start or stop the
 * upload process of the current show to the drones.
 */
const ShowUploadDialogButton = ({ loading, status, ...rest }) => (
  <ListItem button disabled={status === Status.OFF} {...rest}>
    <StatusLight status={status} />
    <ListItemTextWithProgress
      primary={loading ? 'Please wait, uploading…' : 'Upload game data'}
      secondary={
        loading ? (
          <UploadProgressBar />
        ) : (
          'Click here to start the upload process'
        )
      }
    />
  </ListItem>
);

ShowUploadDialogButton.propTypes = {
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  status: PropTypes.oneOf(Object.values(Status)),
};

export default connect(
  // mapStateToProps
  (state) => ({
    loading: isUploadInProgress(state),
    progress: getUploadProgress(state),
    status: getSetupStageStatuses(state).uploadShow,
  }),
  // mapDispatchToProps
  {
    onClick: () => openUploadDialogForJob({ job: SHOW_UPLOAD_JOB }),
  }
)(ShowUploadDialogButton);

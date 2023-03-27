import {
  synchronizeShowSettings,
} from '~/features/show/slice';
/**
 * Handles a SHOW-CFG message from a Skybrush server and updates the
 * state of the Redux store appropriately.
 *
 * @param  {Object} body  the body of the SHOW-CFG message
 * @param  {function} dispatch  the dispatch function of the Redux store
 */
export function handleShowConfigMessage(body, dispatch) {
  // reload the show congfuration from the server
  dispatch(synchronizeShowSettings('fromServer'));
}

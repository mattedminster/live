import isNil from 'lodash-es/isNil';
import isUndefined from 'lodash-es/isUndefined';
import mapValues from 'lodash-es/mapValues';
import omitBy from 'lodash-es/omitBy';

import { setBeaconStateMultiple } from '~/features/beacons/slice';

export const mapPosition = (positionFromServer) =>
  positionFromServer &&
  Array.isArray(positionFromServer) &&
  (positionFromServer[0] !== 0 || positionFromServer[1] !== 0)
    ? {
        lat: positionFromServer[0] / 1e7,
        lon: positionFromServer[1] / 1e7,
        amsl: isNil(positionFromServer[2]) ? null : positionFromServer[2] / 1e3,
        agl: isNil(positionFromServer[3]) ? null : positionFromServer[3] / 1e3,
      }
    : null;

export const mapAttitude = (attitudeFromServer) =>
    attitudeFromServer &&
    Array.isArray(attitudeFromServer) &&
    (attitudeFromServer[0] !== 0 || attitudeFromServer[1] !== 0)
      ? {
          lat: attitudeFromServer[0] / 1e7,
          lon: attitudeFromServer[1] / 1e7,
          amsl: isNil(attitudeFromServer[2]) ? null : attitudeFromServer[2] / 1e3,
          agl: isNil(attitudeFromServer[3]) ? null : attitudeFromServer[3] / 1e3,
        }
      : null;

export const mapHeading = (headingFromServer) =>
  headingFromServer && typeof headingFromServer === 'number'
    ? headingFromServer / 10
    : null;

/**
 * Handles a BCN-INF message from a Skybrush server and updates the
 * state of the Redux store appropriately.
 *
 * @param  {Object} body  the body of the DOCK-INF message
 * @param  {function} dispatch  the dispatch function of the Redux store
 */
export function handleBeaconInformationMessage(body, dispatch) {
  // Map the status objects from the server into the format expected
  // by our Redux actions. Omit keys for which the values are not
  // provided by the server.

  const states = mapValues(body.status, ({ id, active, heading, position, attitude }) =>
    omitBy(
      {
        id,
        position: mapPosition(position),
        heading: mapHeading(heading),
        active,
        attitude,
      },
      isUndefined
    )
  );

  dispatch(setBeaconStateMultiple(states));
}

/**
 * Handles a BCN-PROPS message from a Skybrush server and updates the
 * state of the Redux store appropriately.
 *
 * @param  {Object} body  the body of the DOCK-INF message
 * @param  {function} dispatch  the dispatch function of the Redux store
 */
export function handleBeaconPropertiesMessage(body, dispatch) {
  // Map the status objects from the server into the format expected
  // by our Redux actions. Omit keys for which the values are not
  // provided by the server.

  const states = mapValues(body.result, ({ id, name }) =>
    omitBy(
      {
        id,
        name,
      },
      isUndefined
    )
  );

  dispatch(setBeaconStateMultiple(states));
}

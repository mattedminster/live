import sortBy from 'lodash-es/sortBy';

import { createSelector } from '@reduxjs/toolkit';

import { getPreferredCoordinateFormatter } from '~/selectors/formatting';

/**
 * Returns the formatted antenna position, or undefined if we do not know the
 * antenna position yet.
 */
export const getFormattedAntennaPosition = createSelector(
  (state) => state.rtk.stats.antenna,
  getPreferredCoordinateFormatter,
  (antennaInfo, formatter) => {
    const { position } = antennaInfo || {};
    return position ? formatter(position) : undefined;
  }
);

/**
 * Returhs a short summary of the antenna description and position, in the
 * format they should appear on the UI.
 */
export const getAntennaInfoSummary = createSelector(
  (state) => state.rtk.stats.antenna,
  getFormattedAntennaPosition,
  (antennaInfo, formattedPosition) => {
    if (!antennaInfo) {
      return { position: undefined, description: undefined };
    }

    const result = {
      position: formattedPosition,
    };

    if (typeof antennaInfo.height === 'number') {
      result.position = `${result.position}, ${antennaInfo.height.toFixed(1)}m`;
    }

    const serialNumber = String(antennaInfo.serialNumber || '');
    if (serialNumber && serialNumber.length > 0) {
      result.description = `${
        antennaInfo.descriptor || ''
      } / SN: ${serialNumber}`;
    } else {
      result.description = String(antennaInfo.descriptor || '');
    }

    return result;
  }
);

/**
 * Returns the list of observed RTCM messages, in the order they should appear
 * on the UI.
 */
export const getDisplayedListOfMessages = createSelector(
  (state) => state.rtk.stats.messages,
  (messages) =>
    sortBy(
      Object.entries(messages || {}).map(([messageId, message]) => ({
        id: messageId,
        ...message,
      })),
      'id'
    )
);

/**
 * Returns the list of satellite CNR values to display, in the order they
 * should appear on the UI.
 */
export const getDisplayedSatelliteCNRValues = createSelector(
  (state) => state.rtk.stats.satellites,
  (satelliteInfos) =>
    sortBy(
      Object.entries(satelliteInfos || {}).map(
        ([satelliteId, satelliteInfo]) => ({
          id: satelliteId,
          ...satelliteInfo,
        })
      ),
      'id'
    )
);
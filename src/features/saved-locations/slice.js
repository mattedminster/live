/**
 * @file Slice of the state object that handles the state of saved locations.
 *
 * The location list includes the current location that can be saved and any
 * other location that the user has saved earlier.
 */

import pull from 'lodash-es/pull';
import { createSlice } from '@reduxjs/toolkit';

import {
  addItemToFront,
  createNewItemInFrontOf,
  replaceItemOrAddToFront,
} from '~/utils/collections';

const { actions, reducer } = createSlice({
  name: 'savedLocations',

  initialState: {
    // byId is a map from saved location ID to the location itself
    byId: {
      overlook: {
        id: 'overlook',
        name: 'Overlook',
        center: {
          lon: -70.967055,
          lat: 43.042423,
        },
        rotation: 0,
        zoom: 20,
        notes: '',
      },
      
    },

    // Order defines the preferred ordering of locations on the UI
    order: ['overlook'],
  },

  reducers: {
    addSavedLocation(state, action) {
      return addItemToFront(state, action.payload);
    },

    createNewSavedLocation(state, action) {
      return createNewItemInFrontOf(state, action);
    },

    deleteSavedLocation(state, action) {
      const currentLocationId = action.payload;

      delete state.byId[currentLocationId];
      pull(state.order, currentLocationId);
    },

    updateSavedLocation(state, action) {
      return replaceItemOrAddToFront(state, action.payload);
    },
  },
});

export { reducer as default, actions };

/**
 * @file Slice of the state object that stores the state of the 3D view.
 */

import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'threeD',

  initialState: {
    camera: {
      position: null,
      rotation: null,
    },

    navigation: {
      mode: 'walk',
      cameraView: 'birdseye',
      parameters: {},
    },

    tooltip: null,

    sceneId: 0,
  },

  reducers: {
    notifySceneRemoval(state) {
      // increase sceneInsrance by 1 -- this is used to force a re-mounting
      // of <a-scene>. This is needed because otherwise the 3D view would crash
      // when it is re-parented in the workbench, which could happen in
      // multiple cases (e.g., when a panel is dropped below the 3D view,
      // creating a new vertical stack). When the 3D view is reparented, all
      // A-Frame-related tags are removed and then re-inserted into the DOM,
      // which confuses the underlying renderer.
      state.sceneId++;
    },

    resetZoom() {
      // Resets the zoom level of the 3D view.
      // Nothing to do here, the saga will handle this action.
    },

    rotateViewTowards() {
      // Rotates the 3D view towards the target given in the action payload.
      // Nothing to do here, the saga will handle this action.
    },

    setCameraPose(state, action) {
      const { position, rotation } = action.payload;
      state.camera.position = position;
      state.camera.rotation = rotation;
    },

    setCameraView(state, action) {
      const { payload } = action;

      if (typeof payload === 'string') {
        state.cameraView = payload;

      } else {
        const { mode, parameters } = payload;

        if (typeof mode === 'string' && typeof parameters === 'object') {
          state.cameraView = mode;

        }
      }
    },

    setNavigationMode(state, action) {
      const { payload } = action;

      if (typeof payload === 'string') {
        state.navigation.mode = payload;
        state.navigation.parameters = {};
      } else {
        const { mode, parameters } = payload;

        if (typeof mode === 'string' && typeof parameters === 'object') {
          state.navigation.mode = mode;
          state.navigation.parameters = parameters;
        }
      }
    },

    showTooltip(state, action) {
      state.tooltip = action.payload ? String(action.payload) : null;
    },

    hideTooltip(state) {
      state.tooltip = null;
    },
  },
});

export const {
  hideTooltip,
  notifySceneRemoval,
  resetZoom,
  rotateViewTowards,
  setCameraView,
  setCameraPose,
  setNavigationMode,
  showTooltip,
} = actions;

export default reducer;

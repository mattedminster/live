/* Object holding well-known panel layouts that may potentially be used in
 * multiple configuration files. Perspective configurations may refer to these
 * by their names only */
const commonLayouts = {
  default: {
    label: 'Default',
    layout: {
      type: 'columns',
      contents: [
        {
          type: 'rows',
          contents: [
            {
              type: 'stack',
              contents: [
                { type: 'panel', component: 'three-d-view', id: 'threeDView' },
              ],
              height: 70,
            },
            {
              type: 'stack',
              contents: [
                { type: 'panel', component: 'uav-list', id: 'uavs' },
              ],
            },
          ],
          width: 38,
        },
      
        {
          type: 'rows',
          contents: [
            {
              type: 'stack',
              contents: [
                { type: 'panel', component: 'map', id: 'map' },
                { type: 'panel', component: 'beacon-list', id: 'beacon-list' },
                {
                  type: 'panel',
                  component: 'saved-location-list',
                  id: 'locations',
                },
                { type: 'panel', component: 'layer-list', id: 'layers' },
              ],
              height: 50,
            },
            {
              type: 'stack',
              contents: [
                { type: 'panel', component: 'game-control', id: 'game' },
                { type: 'panel', component: 'light-control', id: 'lights' },
              ],
            },
          ],
          width: 25,
        },
      ],
    },
  },
};

export default commonLayouts;

import { type FontFamily } from 'ui/font';

import nokiaFontFile from './resources/nokiafc22.ttf';

export const nokia: FontFamily = {
  fontFamily: 'nokia',
  fontFiles: [
    {
      uri: nokiaFontFile,
      format: 'truetype',
    },
  ],
  unscaledFontSize: 8,
  unscaledLineHeight: 10,
};

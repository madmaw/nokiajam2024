import { type FontFamily } from 'ui/font';

import nokiaFontFile from './resources/nokiafc22.ttf';
import nokiaThinFontFile from './resources/nokiafc22thin.ttf';

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

export const nokiaThin: FontFamily = {
  fontFamily: 'nokia thin',
  fontFiles: [
    {
      uri: nokiaThinFontFile,
      format: 'truetype',
    },
  ],
  unscaledFontSize: 8,
  unscaledLineHeight: 10,
};

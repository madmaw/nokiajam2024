import { type Fonts } from 'model/settings';

import { FontFaceLoader } from './font_face_loader';
import { FontsRulesRenderer } from './font_rules_renderer';
import {
  nokia,
  nokiaThin,
} from './nokia';

export function install() {
  const allFonts = [
    nokia,
    nokiaThin,
  ];
  const fonts: Fonts = {
    body: nokia,
    detail: nokiaThin,
    // TODO large font
    large: nokia,
  };

  const fontLoader = new FontFaceLoader();

  const promises = allFonts.map(function (font) {
    return fontLoader.loadFontFamily(font);
  });

  const fontLoadPromise = Promise.all(promises).then(function() {
    return;
  });

  function FontRulesRendererImpl() {
    return (
      <>
        {allFonts.map(function (font) {
          return (
            <FontsRulesRenderer
              key={font.fontFamily}
              {...font}
            />
          );
        })}
      </>
    );
  }

  return {
    fonts,
    fontLoadPromise,
    FontRulesRenderer: FontRulesRendererImpl,
  };
}

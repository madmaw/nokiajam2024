import { FontFaceLoader } from './font_face_loader';
import { FontsRulesRenderer } from './font_rules_renderer';
import { nokia } from './nokia';

export function install() {
  const fonts = [nokia];

  const fontLoader = new FontFaceLoader();

  const promises = fonts.map(function (font) {
    return fontLoader.loadFontFamily(font);
  });

  const fontLoadPromise = Promise.all(promises).then(function() {
    return;
  });

  function FontRulesRendererImpl() {
    return (
      <>
        {fonts.map(function (font) {
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

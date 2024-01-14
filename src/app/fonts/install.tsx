import { createPartialObserverComponent } from 'base/react/partial';

import { FontsLoader } from './font_loader';
import { nokia } from './nokia';

export function install() {
  const fonts = [nokia];

  // TODO observe selected font somehow
  const FontLoader = createPartialObserverComponent(FontsLoader, function () {
    return nokia;
  });
  return {
    FontLoader,
    fonts,
  };
}

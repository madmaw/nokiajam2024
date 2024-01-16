import { observer } from 'mobx-react';
import { Settings } from 'model/settings';

import { install as installColorSchemes } from './color_schemes/install';
import { install as installFonts } from './fonts/install';
import { install as installHome } from './home/install';
import { install as installInput } from './input/install';
import { install as installSkeleton } from './skeleton/install';
import { install as installUi } from './ui/install';

export function install() {
  const { defaultColorScheme } = installColorSchemes();
  const {
    FontLoader,
    fonts,
  } = installFonts();
  const settings = new Settings(defaultColorScheme, fonts[0]);
  const {
    InputInstaller,
    input,
  } = installInput();

  const {
    Skeleton,
    contentHolder,
  } = installSkeleton({ settings });
  const {
    Button,
    Text,
    TextMenu,
  } = installUi({
    settings,
  });

  const { Home } = installHome({
    TitleText: Text,
    TextMenu,
  });

  contentHolder.Content = function () {
    return (
      <Home input={input}/>
    );
  };

  return observer(function () {
    return (
      <>
        <InputInstaller/>
        <FontLoader />
        <Skeleton/>
      </>
    );
  });
}

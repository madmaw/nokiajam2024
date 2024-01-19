import { Settings } from 'model/settings';

import { install as installColorSchemes } from './color_schemes/install';
import { install as installFonts } from './fonts/install';
import { install as installInput } from './input/install';
import { install as installHome } from './screen/home/install';
import { install as installSettings } from './screen/settings/install';
import { install as installSkeleton } from './skeleton/install';
import { install as installUi } from './ui/install';

export function install() {
  const {
    defaultColorScheme,
    colorSchemes,
  } = installColorSchemes();
  const {
    FontLoader,
    fonts,
  } = installFonts();
  const {
    InputInstaller,
    input,
  } = installInput();

  const settings = new Settings(defaultColorScheme, fonts[0]);
  const {
    Skeleton,
    contentController,
  } = installSkeleton({
    settings,
  });

  const {
    Button,
    Text,
    TextMenu,
  } = installUi({
    settings,
  });

  const { SettingsScreen } = installSettings({
    TextMenu,
    contentController,
    colorSchemes,
    settings,
  });

  const { HomeScreen } = installHome({
    TextMenu,
    SettingsScreen,
    contentController,
  });

  contentController.pushScreen({
    Component: HomeScreen,
    key: 'home',
  });

  return function () {
    return (
      <>
        <InputInstaller/>
        <FontLoader />
        <Skeleton
          input={input}
          output={undefined}
        />
      </>
    );
  };
}

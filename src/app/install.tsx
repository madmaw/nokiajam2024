import { Settings } from 'model/settings';

import { install as installColorSchemes } from './color_schemes/install';
import { install as installFonts } from './fonts/install';
import { install as installInput } from './input/install';
import { install as installHome } from './screen/home/install';
import { install as installSettings } from './screen/settings/install';
import { install as installTheme } from './screen/settings/theme/install';
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
  const settings = new Settings(defaultColorScheme, fonts[0]);
  const {
    InputInstaller,
    input,
  } = installInput();

  const {
    Skeleton,
    contentHolder,
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

  const { ThemeScreen } = installTheme({
    TitleText: Text,
    TextMenu,
    colorSchemes,
    settings,
  });

  const { SettingsScreen } = installSettings({
    TitleText: Text,
    TextMenu,
  });

  const { HomeScreen } = installHome({
    TitleText: Text,
    TextMenu,
  });

  contentHolder.Content = function () {
    return (
      <HomeScreen
        input={input}
        output={undefined}
      />
    );
  };

  contentHolder.Content = function () {
    return (
      <ThemeScreen
        input={input}
        output={undefined}
      />
    );
  };

  return function () {
    return (
      <>
        <InputInstaller/>
        <FontLoader />
        <Skeleton/>
      </>
    );
  };
}

import { observer } from 'mobx-react';
import { Settings } from 'model/settings';

import { install as installColorSchemes } from './color_schemes/install';
import { install as installFonts } from './fonts/install';
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
    KeyInstaller,
    input,
  } = installInput();

  const {
    Skeleton,
    contentHolder,
  } = installSkeleton({ settings });
  const {
    Button,
    Text,
    Menu,
    MenuItem,
  } = installUi({
    settings,
  });

  contentHolder.Content = function () {
    return (
      <>
        <Menu
          title="Mnu"
          input={input}
        >
          <MenuItem label="Hellog!!?"/>
          <MenuItem label="Item A" />
          <MenuItem label="Item B" />
          <MenuItem label="Item C" />
          <MenuItem label="Item D" />
          <Button label="Item E" />
          <MenuItem label="Item F" />

        </Menu>
      </>

    );
  };

  return observer(function () {
    return (
      <>
        <KeyInstaller/>
        <FontLoader />
        <Skeleton/>
      </>
    );
  });
}

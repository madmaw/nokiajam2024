import { type ContentController } from 'app/skeleton/content_controller';
import {
  type TextMenuItem,
  type TextMenuScreen,
} from 'app/ui/menu/types';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { type Settings } from 'model/settings';
import { type ColorScheme } from 'ui/color_scheme';
import { type ScreenComponentProps } from 'ui/stack/stack';

import { install as installTheme } from './theme/install';

const enum SettingsMenuIds {
  Theme = 1,
  Scanlines,
  Shadows,
  Ghosting,
  Blur,
  Debug,
}

type TextMenuItemWithId = TextMenuItem & {
  id: SettingsMenuIds,
};

const itemTheme: TextMenuItemWithId = {
  id: SettingsMenuIds.Theme,
  label: 'Theme',
};

export function install({
  TextMenu,
  contentController,
  settings,
  colorSchemes,
}: {
  TextMenu: TextMenuScreen,
  contentController: ContentController,
  settings: Settings,
  colorSchemes: ColorScheme[],
}) {

  const { ThemeScreen } = installTheme({
    TextMenu,
    colorSchemes,
    settings,
  });

  function activateItem(item: TextMenuItem) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, prefer-destructuring
    const id = (item as TextMenuItemWithId).id;
    switch (id) {
      case SettingsMenuIds.Theme:
        contentController.pushScreen({
          Component: ThemeScreen,
          key: 'theme',
        });
        break;
      case SettingsMenuIds.Scanlines:
        runInAction(function () {
          settings.scanlines = !settings.scanlines;
        });
        break;
      case SettingsMenuIds.Shadows:
        runInAction(function () {
          settings.shadows = !settings.shadows;
        });
        break;
      case SettingsMenuIds.Blur:
        runInAction(function () {
          settings.blur = !settings.blur;
        });
        break;
      case SettingsMenuIds.Ghosting:
        runInAction(function () {
          settings.ghosting = !settings.ghosting;
        });
        break;
      case SettingsMenuIds.Debug:
        runInAction(function () {
          settings.debug = !settings.debug;
        });
        break;
      default:
    }
  }

  function Footer() {
    return (<>Select</>);
  }

  const SettingsScreen = observer(function ({
    input,
    output,
    requestPop,
  }: ScreenComponentProps) {

    // should only re-render when settings changes, so...safe
    const itemGhosting = {
      id: SettingsMenuIds.Ghosting,
      label: 'Ghosting',
      checked: settings.ghosting,
    };
    const itemScanlines = {
      id: SettingsMenuIds.Scanlines,
      label: 'Pixel Edges',
      checked: settings.scanlines,
    };
    const itemShadows = {
      id: SettingsMenuIds.Shadows,
      label: 'Shadows',
      checked: settings.shadows,
    };
    const itemBlur = {
      id: SettingsMenuIds.Blur,
      label: 'Blur',
      checked: settings.blur,
    };
    const itemDebug = {
      id: SettingsMenuIds.Debug,
      label: 'Debug',
      checked: settings.debug,
    };
    const items: TextMenuItemWithId[] = [
      itemTheme,
      itemGhosting,
      itemScanlines,
      itemShadows,
      itemBlur,
      itemDebug,
    ];

    return (
      <TextMenu
        title='Settings'
        Footer={Footer}
        input={input}
        output={output}
        items={items}
        activateItem={activateItem}
        requestBack={requestPop}
      />
    );
  });

  return {
    SettingsScreen,
  };
}

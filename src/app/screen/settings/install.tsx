import { type ContentController } from 'app/skeleton/content_controller';
import {
  type TextMenuItem,
  type TextMenuScreen,
} from 'app/ui/menu/types';
import { type Settings } from 'model/settings';
import { type ColorScheme } from 'ui/color_scheme';
import { type ScreenComponentProps } from 'ui/stack/stack';

import { install as installTheme } from './theme/install';

const itemTheme: TextMenuItem = {
  label: 'Theme',
};

const items: TextMenuItem[] = [itemTheme];

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
    switch (item) {
      case itemTheme:
        contentController.pushScreen({
          Component: ThemeScreen,
          key: 'theme',
        });
        break;
      default:
    }
  }

  function Footer() {
    return (<>Select</>);
  }

  function SettingsScreen({
    input,
    output,
    requestPop,
  }: ScreenComponentProps) {
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
  }

  return {
    SettingsScreen,
  };
}

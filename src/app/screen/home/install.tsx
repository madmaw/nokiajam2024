import { type ContentController } from 'app/skeleton/content_controller';
import {
  type TextMenuItem,
  type TextMenuScreen,
} from 'app/ui/menu/types';
import { type MaybeWithInput } from 'ui/input';
import { type ScreenComponent } from 'ui/stack/stack';

const itemSettings: TextMenuItem = {
  label: 'Settings',
};
const items: TextMenuItem[] = [
  {
    label: 'New Game',
  },
  {
    label: 'Continue',
  },
  itemSettings,
  {
    label: 'Exit',
  },
];

export function install({
  TextMenu,
  SettingsScreen,
  contentController,
}: {
  TextMenu: TextMenuScreen,
  SettingsScreen: ScreenComponent,
  contentController: ContentController,
}) {
  function activateItem(item: TextMenuItem, index: number) {
    switch (item) {
      case itemSettings:
        contentController.pushScreen({
          Component: SettingsScreen,
          key: 'settings',
        });
        break;
      default:
        console.log(item, index);
    }
  }

  function Footer() {
    return (<>Select</>);
  }

  function HomeScreen({
    input,
    output,
  }: MaybeWithInput) {
    return (
      <TextMenu
        input={input}
        output={output}
        items={items}
        activateItem={activateItem}
        title='Home'
        Footer={Footer}
      />
    );
  }

  return {
    HomeScreen,
  };
}

import {
  type TextMenuItem,
  type TextMenuScreen,
} from 'app/ui/menu/types';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { type Settings } from 'model/settings';
import { type ColorScheme } from 'ui/color_scheme';
import { type ScreenComponentProps } from 'ui/stack/stack';

export function install({
  TextMenu,
  colorSchemes,
  settings,
}: {
  TextMenu: TextMenuScreen,
  colorSchemes: ColorScheme[],
  settings: Settings,
}) {

  function Footer() {
    return (<>Use Theme</>);
  }

  function activateItem(_: TextMenuItem, index: number) {
    runInAction(function () {
      settings.colorScheme = colorSchemes[index];
    });
  }

  const ThemeScreen = observer(function ({
    input,
    output,
    requestPop,
  }: ScreenComponentProps) {

    const items: TextMenuItem[] = colorSchemes.map(function (colorScheme) {
      return {
        label: colorScheme.name,
        checked: colorScheme === settings.colorScheme,
      };
    }, []);

    return (
      <TextMenu
        input={input}
        output={output}
        items={items}
        activateItem={activateItem}
        initialSelectedItemIndex={colorSchemes.indexOf(settings.colorScheme)}
        title='Theme'
        Footer={Footer}
        requestBack={requestPop}
      />
    );
  });

  return {
    ThemeScreen,
  };
}

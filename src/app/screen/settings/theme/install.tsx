import {
  type TextMenuItem,
  type TextMenuScreen,
} from 'app/ui/menu/types';
import { runInAction } from 'mobx';
import { type Settings } from 'model/settings';
import { useCallback } from 'react';
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

  const colorSchemeItems: TextMenuItem[] = colorSchemes.map(function (colorScheme) {
    return {
      label: colorScheme.name,
    };
  }, []);
  const items = colorSchemeItems;

  function Footer() {
    return (<>OK</>);
  }

  function selectItemIndex(index: number) {
    runInAction(function () {
      settings.colorScheme = colorSchemes[index];
    });
  }

  function ThemeScreen({
    input,
    output,
    requestPop,
  }: ScreenComponentProps) {
    const activateItem = useCallback(function() {
      requestPop?.();
    }, [requestPop]);

    return (
      <TextMenu
        input={input}
        output={output}
        items={items}
        activateItem={activateItem}
        selectItemIndex={selectItemIndex}
        initialSelectedItemIndex={colorSchemes.indexOf(settings.colorScheme)}
        title='Theme'
        Footer={Footer}
      />
    );
  }

  return {
    ThemeScreen,
  };
}

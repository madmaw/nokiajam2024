import {
  type TextMenu,
  type TextMenuItem,
} from 'app/ui/menu/types';
import { createPartialObserverComponent } from 'base/react/partial';
import { runInAction } from 'mobx';
import { type Settings } from 'model/settings';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { type ColorScheme } from 'ui/color_scheme';
import { type MaybeWithInput } from 'ui/input';
import { MasterDetail } from 'ui/master_detail';

const back: TextMenuItem = {
  label: 'Back',
};

export function install({
  TitleText,
  TextMenu,
  colorSchemes,
  settings,
}: {
  TitleText: ComponentType<PropsWithChildren>,
  TextMenu: TextMenu
  colorSchemes: ColorScheme[],
  settings: Settings,
}) {
  const colorSchemeItems: TextMenuItem[] = colorSchemes.map(function (colorScheme) {
    return {
      label: colorScheme.name,
    };
  }, []);
  const items = [
    ...colorSchemeItems,
    back,
  ];

  function activateItem(item: TextMenuItem, index: number) {
    if (item === back) {
      console.log('back');
    } else {
      runInAction(function () {
        settings.colorScheme = colorSchemes[index];
      });
    }
  }

  const Heading = createPartialObserverComponent(TitleText, function () {
    return {
      children: 'Theme',
    };
  });

  function ThemeScreen({
    input,
    output,
  }: MaybeWithInput) {
    return (
      <MasterDetail
        Heading={Heading}
      >
        <TextMenu
          input={input}
          output={output}
          items={items}
          activateItem={activateItem}
        />
      </MasterDetail>
    );
  }

  return {
    ThemeScreen,
  };
}

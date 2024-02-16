import { type Settings } from 'model/settings';

import { install as installButton } from './button/install';
import { install as installIcons } from './icon/install';
import { install as installTextMenu } from './menu/install';
import { install as installTypography } from './typography/install';

export function install(params: { settings: Settings }) {
  const {
    TickIcon,
    iconPromise,
  } = installIcons();
  const {
    TextBody,
    TextDetail,
    TextLarge,
    TextDebug,
  } = installTypography(params);
  const { Button } = installButton({ Text: TextBody });
  const {
    TextMenu,
  } = installTextMenu({
    Button,
    TitleText: TextDetail,
    FooterText: TextDetail,
    CheckIcon: TickIcon,
  });
  return {
    TextBody,
    TextDebug,
    Button,
    TextMenu,
    iconPromise,
  };
}

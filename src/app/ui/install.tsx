import { type Settings } from 'model/settings';

import { install as installButton } from './button/install';
import { install as installTextMenu } from './menu/install';
import { install as installTypography } from './typography/install';

export function install(params: { settings: Settings }) {
  const {
    TextBody,
    TextDetail,
    TextTitle,
  } = installTypography(params);
  const { Button } = installButton({ Text: TextBody });
  const {
    TextMenu,
  } = installTextMenu({
    Button,
    TitleText: TextBody,
    FooterText: TextDetail,
  });
  return {
    Text: TextBody,
    Button,
    TextMenu,
  };
}

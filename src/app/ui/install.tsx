import { type Settings } from 'model/settings';

import { install as installButton } from './button/install';
import { install as installMenu } from './menu/install';
import { install as installTypography } from './typography/install';

export function install(params: { settings: Settings }) {
  const { Text } = installTypography(params);
  const { Button } = installButton({ Text });
  const {
    Menu,
    MenuItem,
  } = installMenu({
    TitleText: Text,
    Button,
  });
  return {
    Text,
    Button,
    Menu,
    MenuItem,
  };
}

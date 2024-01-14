import { nokiaGray } from './nokia_gray';
import { nokiaHarsh } from './nokia_harsh';
import { nokiaOriginal } from './nokia_original';

export function install() {
  const colorSchemes = [
    nokiaOriginal,
    nokiaHarsh,
    nokiaGray,
  ];
  return {
    defaultColorScheme: nokiaOriginal,
    colorSchemes,
  };
}

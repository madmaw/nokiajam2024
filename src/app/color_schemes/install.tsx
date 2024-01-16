import { blackAndWhite } from './black_and_white';
import { nokiaGray } from './nokia_gray';
import { nokiaHarsh } from './nokia_harsh';
import { nokiaOriginal } from './nokia_original';

export function install() {
  const colorSchemes = [
    nokiaOriginal,
    nokiaHarsh,
    nokiaGray,
    blackAndWhite,
  ];
  return {
    defaultColorScheme: nokiaOriginal,
    colorSchemes,
  };
}

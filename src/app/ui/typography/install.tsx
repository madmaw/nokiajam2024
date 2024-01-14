import { createPartialObserverComponent } from 'base/react/partial';
import { type Settings } from 'model/settings';
import { Text } from 'ui/typography/text';

export function install({
  settings,
}: {
  settings: Settings,
}) {
  const TextWithTheme = createPartialObserverComponent(
    Text,
    function() {
      return settings.body;
    },
  );
  return {
    Text: TextWithTheme,
  };
}

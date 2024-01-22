import { createPartialObserverComponent } from 'base/react/partial';
import { type Settings } from 'model/settings';
import { Text } from 'ui/typography/text';

export function install({
  settings,
}: {
  settings: Settings,
}) {
  const TextBody = createPartialObserverComponent(
    Text,
    function() {
      return settings.fonts.body;
    },
  );
  const TextDetail = createPartialObserverComponent(
    Text,
    function () {
      return settings.fonts.detail;
    },
  );
  const TextLarge = createPartialObserverComponent(
    Text,
    function () {
      return settings.fonts.large;
    },
  );

  return {
    TextBody,
    TextDetail,
    TextLarge,
  };
}

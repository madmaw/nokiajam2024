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
      return settings.fonts.body;
    },
  );
  const TextTitle = createPartialObserverComponent(
    Text,
    function () {
      return settings.fonts.body;
    },
  );

  return {
    TextBody,
    TextDetail,
    TextTitle,
  };
}

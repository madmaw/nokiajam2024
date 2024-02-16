import { createPartialObserverComponent } from 'base/react/partial';
import { type Settings } from 'model/settings';
import { Debug } from 'ui/debug/debug';
import { FrameCounter } from 'ui/debug/types';

import { type Text } from '../typography/types';

export function install({
  Text,
  settings,
}: {
  Text: Text,
  settings: Settings,
}) {
  const frameCounter = new FrameCounter();

  const DebugOverlay = createPartialObserverComponent(Debug, function () {
    return {
      updating: frameCounter.updating && settings.debug,
      framesPerSecond: frameCounter.framesPerSecond,
      updatesPerSecond: frameCounter.updatesPerSecond,
      Text,
    };
  });

  return {
    frameCounter,
    DebugOverlay,
  };
}

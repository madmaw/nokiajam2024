import { createPartialObserverComponent } from 'base/react/partial';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { type Settings } from 'model/settings';
import { type ComponentType } from 'react';
import { GhostOverlay } from 'ui/ghost/ghost_overlay';
import { type MaybeWithInput } from 'ui/input';
import { Stack } from 'ui/stack/stack';

import {
  ContentController,
  ContentHolder,
} from './content_controller';
import { type OverlayController } from './overlay_controller';
import { Skeleton } from './skeleton';

export function install({
  settings,
  DebugOverlay,
}: {
  readonly settings: Settings,
  readonly DebugOverlay: React.ComponentType,
}): {
  contentController: ContentController,
  overlayController: OverlayController,
  Skeleton: ComponentType<MaybeWithInput>,
} {

  const SkeletonWithTheme = createPartialObserverComponent(
    Skeleton,
    function () {
      const {
        foreground,
        background,
        backlit,
        blur,
        ghosting,
        shadows,
        scanlines,
      } = settings;
      return {
        foreground,
        background,
        backlit,
        blur,
        ghosting,
        shadows,
        scanlines,
        DebugOverlay,
      };
    },
  );
  const maybeOverlayController: {
    forceUpdate: ((canvas?: HTMLCanvasElement | OffscreenCanvas) => void) | undefined,
  } = { forceUpdate: undefined };
  const contentHolder = new ContentHolder();
  const contentController = new ContentController(contentHolder);
  const requestPop = action(function () {
    contentController.popScreen();
  });
  const SkeletonWithThemeAndContent = observer(function ({
    input,
    output,
  }: MaybeWithInput) {
    const { screens } = contentHolder;
    return (
      <SkeletonWithTheme>
        <GhostOverlay
          forceUpdateContainer={maybeOverlayController}
          enabled={settings.ghosting}
        >
          <Stack
            screens={screens}
            requestPop={requestPop}
            input={input}
            output={output}
          />

        </GhostOverlay>
      </SkeletonWithTheme>
    );
  });
  return {
    Skeleton: SkeletonWithThemeAndContent,
    contentController,
    overlayController: {
      forceUpdate: function (canvas?: HTMLCanvasElement | OffscreenCanvas) {
        maybeOverlayController.forceUpdate?.(canvas);
      },
    },
  };
}

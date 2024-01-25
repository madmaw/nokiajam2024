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
}: {
  readonly settings: Settings,
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
      } = settings;
      return {
        foreground,
        background,
        backlit,
      };
    },
  );
  const maybeOverlayController: {
    forceUpdate: (() => void) | undefined,
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
        <GhostOverlay forceUpdateContainer={maybeOverlayController}>
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
      forceUpdate: function () {
        maybeOverlayController.forceUpdate?.();
      },
    },
  };
}

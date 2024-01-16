import { createPartialObserverComponent } from 'base/react/partial';
import { observer } from 'mobx-react';
import { type Settings } from 'model/settings';

import { ContentHolder } from './content_holder';
import { Skeleton } from './skeleton';

export function install({
  settings,
}: {
  readonly settings: Settings,
}) {

  const SkeletonWithTheme = createPartialObserverComponent(
    Skeleton,
    function () {
      const {
        foreground, background, 
      } = settings;
      return {
        foreground,
        background,
      };
    },
  );
  const contentHolder = new ContentHolder();
  const SkeletonWithThemeAndContent = observer(function () {
    const { Content } = contentHolder;
    return (
      <SkeletonWithTheme>
        {Content && <Content/>}
      </SkeletonWithTheme>
    );
  });
  return {
    Skeleton: SkeletonWithThemeAndContent,
    contentHolder,
  };
}

import { loadImage } from 'base/load_image';
import { pxPerNpx } from 'base/metrics';
import { createPartialObserverComponent } from 'base/react/partial';
import {
  observable,
  runInAction,
} from 'mobx';
import { type ComponentType } from 'react';
import { Icon as IconComponent } from 'ui/icon';

import tickUrl from './resources/tick.gif';
import { type Icon } from './types';

export function install(): {
  readonly TickIcon: ComponentType,
  readonly iconPromise: Promise<void>,
  } {
  const imageDimensions = observable.map<string, readonly [number, number]>();

  const iconUrls = [tickUrl];
  const [TickIcon] = iconUrls.map<Icon>(function (src) {
    return createPartialObserverComponent(IconComponent, function() {
      return {
        src,
        dimensions: imageDimensions.get(src),
      };
    });
  });

  const iconPromise = Promise.all(iconUrls.map(async function (src) {
    const image = await loadImage(src);
    runInAction(function () {
      imageDimensions.set(src, [
        image.naturalWidth * pxPerNpx,
        image.naturalHeight * pxPerNpx,
      ]);
    });
  })).then(function () {
    return;
  });

  return {
    TickIcon,
    iconPromise,
  };
}

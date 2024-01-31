import { type OverlayController } from 'app/skeleton/overlay_controller';
import {
  useEffect,
  useState,
} from 'react';
import { AnimatedGif } from 'ui/gif/animated_gif';
import {
  type Input,
  InputAction,
  InputProgress,
} from 'ui/input';
import {
  type ScreenComponent,
  type ScreenComponentProps,
} from 'ui/stack/stack';

import clownUrl from './resources/clown.gif';
import ninjaUrl from './resources/ninja.gif';
import pogoDogUrl from './resources/pogo_dog.gif';

const urls = [
  pogoDogUrl,
  ninjaUrl,
  clownUrl,
];

export function install({
  overlayController,
}: {
  overlayController: OverlayController
}): {
  AnimationScreen: ScreenComponent,
  } {

  function AnimationScreen({
    input,
    requestPop,
  }: ScreenComponentProps) {
    const [
      gifIndex,
      setGifIndex,
    ] = useState<number>(0);
    const gifUrl = urls[gifIndex];
    useEffect(function () {
      if (input == null) {
        return;
      }
      const subscription = input.subscribe(function (input: Input) {
        if (input.progress !== InputProgress.Commit) {
          return;
        }
        switch(input.action) {
          case InputAction.Back:
            requestPop?.();
            break;
          case InputAction.Left:
            setGifIndex((gifIndex + urls.length - 1) % urls.length);
            break;
          case InputAction.Right:
            setGifIndex((gifIndex + 1) % urls.length);
            break;
          default:
        }
      });
      return subscription.unsubscribe.bind(subscription);
    }, [
      input,
      requestPop,
      gifIndex,
    ]);
    return (
      <AnimatedGif
        onFrame={overlayController.forceUpdate}
        src={gifUrl}
        loop={true}
      />
    );
  }

  return {
    AnimationScreen,
  };
}

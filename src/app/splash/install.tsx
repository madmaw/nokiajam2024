import { type OverlayController } from 'app/skeleton/overlay_controller';
import { useEffect } from 'react';
import { type Observable } from 'rxjs';
import {
  type Input,
  InputProgress,
} from 'ui/input';

import { AnimatedSplashScreen } from './animated_splash_screen';
import backgroundUrl from './resources/bg.png';
import nokiaClassicAnimationUrl from './resources/nokia_classic.gif';

export function install({
  overlayController,
}: {
  overlayController: OverlayController,
}) {

  let animationComplete: () => void;

  function SplashScreen({
    input,
  }: {
    readonly input: Observable<Input>
  }) {
    useEffect(function () {
      input.subscribe(function (input: Input) {
        if (input.progress !== InputProgress.Commit) {
          return;
        }
        animationComplete();
      });
    }, [input]);

    return (
      <AnimatedSplashScreen
        backgroundUrl={backgroundUrl}
        gifUrl={nokiaClassicAnimationUrl}
        animationComplete={animationComplete}
        animationChanged={overlayController.forceUpdate}
      />
    );
  }

  const splashScreenAnimationPromise = new Promise<void>(function (resolve) {
    animationComplete = resolve;
  });

  return {
    splashScreenAnimationPromise,
    SplashScreen,
  };
}

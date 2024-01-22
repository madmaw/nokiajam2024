import { AnimatedSplashScreen } from './animated_splash_screen';
import backgroundUrl from './resources/bg.png';
import nokiaClassicAnimationUrl from './resources/nokia_classic.gif';

export function install() {

  let animationComplete: () => void;

  function SplashScreen() {
    return (
      <AnimatedSplashScreen
        backgroundUrl={backgroundUrl}
        gifUrl={nokiaClassicAnimationUrl}
        animationComplete={animationComplete}
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

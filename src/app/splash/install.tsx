import { NokiaSplashScreen } from './nokia_splash_screen';

export function install() {

  let animationComplete: () => void;

  function SplashScreen() {
    return (
      <NokiaSplashScreen animationComplete={animationComplete}/>
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

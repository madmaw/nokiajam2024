import { SplashScreen as SplashScreenImpl } from './splash_screen';

export function install() {

  let animationComplete: () => void;

  function SplashScreen() {
    return (
      <SplashScreenImpl animationComplete={animationComplete}/>
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

import { createPartialObserverComponent } from 'base/react/partial';
import { fromPromise } from 'mobx-utils';
import { Settings } from 'model/settings';
import { Loading } from 'ui/loading';
import { type ScreenComponentProps } from 'ui/stack/stack';

import { install as installColorSchemes } from './color_schemes/install';
import { install as installFonts } from './fonts/install';
import { install as installInput } from './input/install';
import { install as installHome } from './screen/home/install';
import { install as installSettings } from './screen/settings/install';
import { install as installTestAnimation } from './screen/test_animation/install';
import { install as installSkeleton } from './skeleton/install';
import { install as installSplashScreen } from './splash/install';
import { install as installDebug } from './ui/debug/install';
import { install as installUi } from './ui/install';

const LoadingScreen: typeof Loading<void, ScreenComponentProps> = Loading;

export function install() {
  const {
    defaultColorScheme,
    colorSchemes,
  } = installColorSchemes();
  const {
    fonts,
    fontLoadPromise,
    FontRulesRenderer,
  } = installFonts();

  const {
    InputInstaller,
    input,
  } = installInput();

  const settings = new Settings(defaultColorScheme, fonts);

  const {
    Button,
    TextDebug,
    TextMenu,
    iconPromise,
  } = installUi({
    settings,
  });

  const {
    DebugOverlay,
    frameCounter,
  } = installDebug({
    Text: TextDebug,
    settings,
  });

  const {
    Skeleton,
    contentController,
    overlayController,
  } = installSkeleton({
    settings,
    DebugOverlay,
  });

  const { AnimationScreen } = installTestAnimation({
    frameCounter,
    overlayController,
  });

  const { SettingsScreen } = installSettings({
    TextMenu,
    contentController,
    colorSchemes,
    settings,
  });

  const { HomeScreen } = installHome({
    TextMenu,
    NewGameScreen: AnimationScreen,
    SettingsScreen,
    contentController,
  });

  // TODO
  function Rejected() {
    return (
      <>Error</>
    );
  }

  const {
    SplashScreen,
    splashScreenAnimationPromise,
  } = installSplashScreen({
    overlayController,
  });

  const initObservable = fromPromise(Promise.all([
    fontLoadPromise,
    splashScreenAnimationPromise,
    iconPromise,
  ]));

  const LoadingHomeScreen = createPartialObserverComponent(
    LoadingScreen,
    function () {
      return {
        observable: initObservable,
        Fulfilled: HomeScreen,
        Pending: SplashScreen,
        Rejected,
      };
    },
  );

  contentController.pushScreen({
    Component: LoadingHomeScreen,
    key: 'home',
  });

  return function () {
    return (
      <>
        <InputInstaller />
        <Skeleton
          input={input}
          output={undefined}
        />
        <FontRulesRenderer />
      </>
    );
  };
}

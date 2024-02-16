import { type OverlayController } from 'app/skeleton/overlay_controller';
import { UnreachableError } from 'base/errors';
import {
  createKeyStates,
  setKeyState,
  unsetKeyState,
} from 'base/key_state';
import { createPartialComponent } from 'base/react/partial';
import { TransitionResult } from 'base/state/types';
import { fromPromise } from 'mobx-utils';
import { EntityStateBuilder } from 'model/builder';
import {
  type Entity,
  type EntityState,
  EntityStateMachine,
  type EntityTransition,
  EntityTransitionType,
  LateralDirection,
  LateralInputNeutral,
  type Orientation,
  OrientationLateralLeft,
  OrientationLateralRight,
  OrientationType,
} from 'model/entity';
import {
  type AnimationFrameGroup,
  applyFrameAnimated,
  createApplyWhenDifferentFrameGroup,
  createApplyWhenFrameCompleted,
  createApplyWhenUnrelatedFrameGroup,
  importEntityStatesFromAnimatedGif,
  orientationGroupAttributes,
} from 'model/import';
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  type Input,
  InputAction,
  InputProgress,
} from 'ui/input';
import { Loading } from 'ui/loading';
import {
  type ScreenComponent,
  type ScreenComponentProps,
} from 'ui/stack/stack';

import ninjaGif from './resources/ninja.gif';
import { TestState } from './test_state';

const ninjaIdleAnimationFrameGroup: AnimationFrameGroup = {
  id: 'idle',
  orientationType: OrientationType.Lateral,
  wrapAnimation: true,
  animationFrames: [
    {
      index: 9,
      ticks: [
        2,
        8,
        16,
      ],
    },
    {
      index: 8,
    },
    {
      index: 7,
    },
    {
      index: 8,
      ticks: [
        2,
        8,
        16,
      ],
    },
    {
      index: 9,
    },
    {
      index: 10,
    },
  ],
};

const ninjaIdleBlinkAnimationFrameGroup: AnimationFrameGroup = {
  id: 'idle-blink',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 11,
      ticks: [
        5,
        10,
        20,
      ],
    },
    {
      index: 12,
    },
    {
      index: 11,
      ticks: [
        5,
        10,
        20,
      ],
    },
  ],
};

const ninjaWalkAnimationFrameGroup: AnimationFrameGroup = {
  id: 'walk',
  orientationType: OrientationType.Lateral,
  wrapAnimation: true,
  animationFrames: [
    {
      index: 23,
    },
    {
      index: 24,
    },
    {
      index: 21,
    },
    {
      index: 22,
    },
  ],
};

const ninjaTurnAnimationFrameGroup: AnimationFrameGroup = {
  id: 'turn',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 37,
    },
    {
      index: 38,
    },
    {
      index: 39,
    },
  ],
};

const ninjaJumpAnimationFrameGroup: AnimationFrameGroup = {
  id: 'jump',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 18,
    },
    // fall
    {
      index: 19,
    },
  ],
};

const ninjaDuckingAnimationFrameGroup: AnimationFrameGroup = {
  id: 'ducking',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 6,
    },
  ],
};

const ninjaStandingAnimationFrameGroup: AnimationFrameGroup = {
  id: 'standing',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 6,
    },
  ],
};

const ninjaDuckAnimationFrameGroup: AnimationFrameGroup = {
  id: 'duck',
  orientationType: OrientationType.Lateral,
  wrapAnimation: true,
  animationFrames: [
    {
      index: 5,
    },
  ],
};

function applyPlayerWalk(e: EntityTransition, _: Entity, attributeValues: Record<'orientation', Orientation>): TransitionResult {
  const { orientation } = attributeValues;
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && orientation.type === OrientationType.Lateral
    && e.lateral === orientation.direction
  ) {
    // TODO set velocity
    return TransitionResult.TransitionAndAbort;
  }
  return TransitionResult.Continue;
}

function applyPlayerTurnLeft(e: EntityTransition, owner: Entity) {
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && e.lateral === LateralDirection.Left
    && owner.state.value.orientation === OrientationLateralRight
  ) {
    // TODO set velocity
    return TransitionResult.TransitionAndAbort;
  }
  return TransitionResult.Continue;
}

function applyPlayerTurnRight(e: EntityTransition, owner: Entity) {
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && e.lateral === LateralDirection.Right
    && owner.state.value.orientation === OrientationLateralLeft
  ) {
    // TODO set velocity
    return TransitionResult.TransitionAndAbort;
  }
  return TransitionResult.Continue;
}

function applyPlayerIdle(e: EntityTransition) {
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && e.lateral === LateralInputNeutral.Neutral
  ) {
    // TODO set velocity? (continue is problematic for this, so maybe let friction do it)
    return TransitionResult.TransitionAndContinue;
  }
  return TransitionResult.Continue;
}

function applyPlayerDuck(e: EntityTransition) {
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && e.down
  ) {
    return TransitionResult.TransitionAndAbort;
  }
  return TransitionResult.Continue;
}

function applyStand(e: EntityTransition) {
  if (
    e.type === EntityTransitionType.Update
    && e.player
    && !e.down
  ) {
    return TransitionResult.TransitionAndAbort;
  }
  return TransitionResult.Continue;
}

function applyInfrequently() {
  return Math.random() < .1 ? TransitionResult.TransitionAndContinue : TransitionResult.Continue;
}

async function importNinjaStateMachine(): Promise<EntityStateMachine> {
  const ninjaState = new EntityStateBuilder('ninja');
  const walkableState = ninjaState.createChild({});

  const ninjaImporter = await importEntityStatesFromAnimatedGif(ninjaGif);

  const [
    idleState,
    walkState,
    idleBlinkState,
  ] = ninjaImporter(
    walkableState,
    [
      ninjaIdleAnimationFrameGroup,
      ninjaWalkAnimationFrameGroup,
      ninjaIdleBlinkAnimationFrameGroup,
    ],
  );

  const [
    turnState,
    duckingState,
    standingState,
    duckState,
  ] = ninjaImporter(
    ninjaState,
    [
      ninjaTurnAnimationFrameGroup,
      ninjaDuckingAnimationFrameGroup,
      ninjaStandingAnimationFrameGroup,
      ninjaDuckAnimationFrameGroup,
    ],
  );

  // note: intentionally backward to flip the orientation (animations are backward to compensate too)
  const [
    turnLeftToRightState,
    turnRightToLeftState,
  ] = turnState.children;

  walkableState
      .addTransition(turnRightToLeftState, applyPlayerTurnLeft)
      .addTransition(turnLeftToRightState, applyPlayerTurnRight)
      .addTransitionAcrossAttributes(walkState, createApplyWhenDifferentFrameGroup(applyPlayerWalk), orientationGroupAttributes)
      .addTransitionAcrossAttributes(idleState, createApplyWhenUnrelatedFrameGroup(applyPlayerIdle), orientationGroupAttributes)
      .addTransitionAcrossAttributes(duckingState, applyPlayerDuck, orientationGroupAttributes);

  duckingState
      // wait for the animation to finish, then duck
      .addTransitionAcrossAttributes(duckState, createApplyWhenFrameCompleted(applyPlayerDuck), orientationGroupAttributes)
      // stand immediately at any point
      .addTransitionAcrossAttributes(idleState, applyStand, orientationGroupAttributes);

  standingState
      // wait for animation to finish, then stand
      .addTransitionAcrossAttributes(idleState, createApplyWhenFrameCompleted(applyStand), orientationGroupAttributes)
      // can re-duck immediately
      .addTransitionAcrossAttributes(duckingState, applyPlayerDuck, orientationGroupAttributes);

  duckState
      .addTransitionAcrossAttributes(standingState, applyStand, orientationGroupAttributes);

  idleState
      .addTransitionAcrossAttributes(idleBlinkState, createApplyWhenFrameCompleted(applyInfrequently), orientationGroupAttributes);

  ninjaState
      // fallback to idle state when any animation runs out
      .addTransitionAcrossAttributes(idleState, createApplyWhenDifferentFrameGroup(applyFrameAnimated), orientationGroupAttributes, 3);

  const states = ninjaState.flatten();
  console.log(states);
  const [initialState] = states;
  return new EntityStateMachine(
    initialState,
  );
}

const EntityStateLoading = Loading<EntityState, ScreenComponentProps>;

export function install({
  overlayController,
}: {
  overlayController: OverlayController
}): {
  AnimationScreen: ScreenComponent,
  loadingPromise: Promise<void>,
} {
  const promise = importNinjaStateMachine();
  const promiseObservable = fromPromise(promise);

  function AnimationScreen({
    value,
    input,
    requestPop,
  }: { value: EntityStateMachine } & ScreenComponentProps) {
    const keyStatesRef = useRef(createKeyStates());
    useEffect(function () {
      if (input == null) {
        return;
      }
      const subscription = input.subscribe(function (input: Input) {
        const keyStates = keyStatesRef.current;
        switch(input.progress) {
          case InputProgress.Start:
            setKeyState(keyStates, input.action);
            break;
          case InputProgress.Stop:
            unsetKeyState(keyStates, input.action);
            break;
          case InputProgress.Commit:
            if (input.action === InputAction.Back) {
              requestPop?.();
            }
            break;
          default:
            throw new UnreachableError(input.progress);
        }
      });
      return subscription.unsubscribe.bind(subscription);
    }, [
      input,
      requestPop,
    ]);

    const entity = useMemo<Entity>(function () {
      return {
        state: value,
        ticksRemaining: 0,
      };
    }, [value]);
    return (
      <TestState
        entity={entity}
        onFrame={overlayController.forceUpdate}
        keyStates={keyStatesRef.current}
      />
    );
  }

  const LoadingAnimationScreen = createPartialComponent(
    EntityStateLoading,
    {
      observable: promiseObservable,
      Pending: () => <div>Loading...</div>,
      Rejected: ({ error }: { error: unknown }) => (
        <div>
          Error:
          {` ${error}`}
        </div>
      ),
      Fulfilled: AnimationScreen,
    },
  );

  return {
    AnimationScreen: LoadingAnimationScreen,
    loadingPromise: promise.then(),
  };
}

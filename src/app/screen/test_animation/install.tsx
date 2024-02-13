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
  MoveLowerIntensity,
  OrientationLateralLeft,
  OrientationLateralRight,
  OrientationType,
} from 'model/entity';
import {
  type AnimationFrameGroup,
  applyFrameAnimated,
  createApplyWhenFrameCompleted,
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
      index: 7,
    },
    {
      index: 8,
    },
  ],
};

const ninjaWalkAnimationFrameGroup: AnimationFrameGroup = {
  id: 'walk',
  orientationType: OrientationType.Lateral,
  wrapAnimation: true,
  animationFrames: [
    {
      index: 13,
    },
    {
      index: 14,
    },
    {
      index: 15,
    },
    {
      index: 16,
    },
  ],
};

const ninjaTurnAnimationFrameGroup: AnimationFrameGroup = {
  id: 'turn',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 29,
    },
    {
      index: 30,
    },
    {
      index: 31,
    },
  ],
};

const ninjaJumpAnimationFrameGroup: AnimationFrameGroup = {
  id: 'jump',
  orientationType: OrientationType.Lateral,
  wrapAnimation: false,
  animationFrames: [
    {
      index: 10,
    },
    // fall
    {
      index: 11,
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

function applyWalkLeft(e: EntityTransition): TransitionResult {
  if (e.type === EntityTransitionType.MoveLateral && e.direction === LateralDirection.Left) {
    // TODO set velocity
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyWalkRight(e: EntityTransition): TransitionResult {
  if (e.type === EntityTransitionType.MoveLateral && e.direction === LateralDirection.Right) {
    // TODO set velocity
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyTurnLeft(e: EntityTransition, owner: Entity) {
  if (e.type === EntityTransitionType.MoveLateral && e.direction === LateralDirection.Left && owner.state.value.orientation === OrientationLateralRight) {
    // TODO set velocity
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyTurnRight(e: EntityTransition, owner: Entity) {
  if (e.type === EntityTransitionType.MoveLateral && e.direction === LateralDirection.Right && owner.state.value.orientation === OrientationLateralLeft) {
    // TODO set velocity
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyIdle(e: EntityTransition) {
  if (e.type === EntityTransitionType.HaltLateral) {
    // TODO set velocity
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyDuck(e: EntityTransition) {
  if (e.type === EntityTransitionType.MoveLower && e.intensity === MoveLowerIntensity.Duck) {
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

function applyStand(e: EntityTransition) {
  if (e.type === EntityTransitionType.MoveLower && e.intensity === MoveLowerIntensity.None) {
    return TransitionResult.Transition;
  }
  return TransitionResult.TryNext;
}

async function importNinjaStateMachine(): Promise<EntityStateMachine> {
  const ninjaState = new EntityStateBuilder('ninja');
  const walkableState = ninjaState.createChild({});

  const ninjaImporter = await importEntityStatesFromAnimatedGif(ninjaGif);

  const [
    idleState,
    walkState,
  ] = ninjaImporter(
    walkableState,
    [
      ninjaIdleAnimationFrameGroup,
      ninjaWalkAnimationFrameGroup,
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

  const [
    walkRightState,
    walkLeftState,
  ] = walkState.knownChildren;

  // note: intentionally backward to flip the orientation (animations are backward to compensate too)
  const [
    turnLeftToRightState,
    turnRightToLeftState,
  ] = turnState.knownChildren;

  walkableState
      .addTransition(turnRightToLeftState, applyTurnLeft)
      .addTransition(turnLeftToRightState, applyTurnRight)
      .addTransition(walkRightState, applyWalkRight)
      .addTransition(walkLeftState, applyWalkLeft)
      .addTransitionAcrossAttributes(idleState, applyIdle, orientationGroupAttributes)
      .addTransitionAcrossAttributes(duckingState, applyDuck, orientationGroupAttributes);

  duckingState
      // wait for the animation to finish, then duck
      .addTransitionAcrossAttributes(duckState, createApplyWhenFrameCompleted(applyDuck), orientationGroupAttributes)
      // stand immediately at any point
      .addTransitionAcrossAttributes(walkableState, applyStand, orientationGroupAttributes);

  standingState
      // wait for animation to finish, then stand
      .addTransitionAcrossAttributes(walkableState, createApplyWhenFrameCompleted(applyStand), orientationGroupAttributes)
      // can duck immediately
      .addTransitionAcrossAttributes(duckingState, applyDuck, orientationGroupAttributes);

  duckState
      .addTransitionAcrossAttributes(standingState, applyStand, orientationGroupAttributes);

  ninjaState
      // revert to idle state when any animation runs out
      .addTransitionAcrossAttributes(walkableState, applyFrameAnimated, orientationGroupAttributes, -1);

  const [initialState] = ninjaState.flatten();
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
            break;
          default:
            throw new UnreachableError(input.progress);
        }
      });
      return subscription.unsubscribe.bind(subscription);
    }, [input]);

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

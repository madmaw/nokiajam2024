import { StateMachine } from 'base/state/machine';
import { type State } from 'base/state/types';

export const enum OrientationType {
  Omnidirectional,
  Lateral,
  Cardinal,
}

export const enum LateralDirection {
  Right = 0,
  Left = 1,
}

export const enum CardinalDirection {
  East = 0,
  North = 1,
  West = 2,
  South = 3,
}

export type Orientation = {
  type: OrientationType.Omnidirectional,
} | {
  type: OrientationType.Lateral,
  direction: LateralDirection,
} | {
  type: OrientationType.Cardinal,
  direction: CardinalDirection,
};

// orientation constants
export const OrientationOmnidirectional: Orientation = {
  type: OrientationType.Omnidirectional,
};

export const OrientationLateralLeft: Orientation = {
  type: OrientationType.Lateral,
  direction: LateralDirection.Left,
};

export const OrientationLateralRight: Orientation = {
  type: OrientationType.Lateral,
  direction: LateralDirection.Right,
};

export const OrientationCardinalNorth: Orientation = {
  type: OrientationType.Cardinal,
  direction: CardinalDirection.North,
};

export const OrientationCardinalSouth: Orientation = {
  type: OrientationType.Cardinal,
  direction: CardinalDirection.South,
};

export const OrientationCardinalEast: Orientation = {
  type: OrientationType.Cardinal,
  direction: CardinalDirection.East,
};

export const OrientationCardinalWest: Orientation = {
  type: OrientationType.Cardinal,
  direction: CardinalDirection.West,
};

export const enum EntityTransitionType {
  FrameAnimated,
  MoveLateral,
  MoveLower,
  HaltLateral,
  Fall,
  Jump,
  Land,
}

export type EntityTransitionFrameAnimated = {
  type: EntityTransitionType.FrameAnimated,
};

export type EntityTransitionMoveLateral = {
  type: EntityTransitionType.MoveLateral,
  direction: LateralDirection,
};

export type EntityTransitionHaltLateral = {
  type: EntityTransitionType.HaltLateral,
};

export type EntityTransitionJump = {
  type: EntityTransitionType.Jump,
};

export const enum MoveLowerIntensity {
  None = 1,
  Duck,
  Fall,
}

export type EntityTransitionMoveLower = {
  type: EntityTransitionType.MoveLower,
  intensity: MoveLowerIntensity,
};

export type EntityTransitionFall = {
  type: EntityTransitionType.Fall,
};

export type EntityTransitionLand = {
  type: EntityTransitionType.Land,
};

export const EntityTransitionFrameAnimated: EntityTransitionFrameAnimated = {
  type: EntityTransitionType.FrameAnimated,
};

export const EntityTransitionHaltLateral: EntityTransitionHaltLateral = {
  type: EntityTransitionType.HaltLateral,
};

export const EntityTransitionMoveLateralRight: EntityTransitionMoveLateral = {
  type: EntityTransitionType.MoveLateral,
  direction: LateralDirection.Right,
};

export const EntityTransitionMoveLateralLeft: EntityTransitionMoveLateral = {
  type: EntityTransitionType.MoveLateral,
  direction: LateralDirection.Left,
};

export const EntityTransitionMoveLowerNone: EntityTransitionMoveLower = {
  type: EntityTransitionType.MoveLower,
  intensity: MoveLowerIntensity.None,
};

export const EntityTransitionMoveLowerDuck: EntityTransitionMoveLower = {
  type: EntityTransitionType.MoveLower,
  intensity: MoveLowerIntensity.Duck,
};

export const EntityTransitionMoveLowerFall: EntityTransitionMoveLower = {
  type: EntityTransitionType.MoveLower,
  intensity: MoveLowerIntensity.Fall,
};

export type EntityTransition =
  | EntityTransitionFrameAnimated
  | EntityTransitionMoveLateral
  | EntityTransitionMoveLower
  | EntityTransitionHaltLateral
  | EntityTransitionJump
  | EntityTransitionFall
  | EntityTransitionLand
  ;

export type EntityStateValue = {
  readonly name: string,
  readonly canvas: HTMLCanvasElement | OffscreenCanvas,
  readonly ticks: number,
  // avoid obfuscation so we can reference this by name
  readonly ['orientation']: Orientation,
  readonly frameGroupId: string,
};

export type EntityState = State<EntityStateValue, EntityTransition, Entity>;
export class EntityStateMachine extends StateMachine<EntityStateValue, EntityTransition, Entity> {
  constructor(initialState: EntityState) {
    super(
      initialState,
      function (e, s1, s2) {
        // can transition to same frame group with animations
        return e !== EntityTransitionFrameAnimated
          // but can't transition to same frame group and orientation otherwise
          && s1.value.frameGroupId === s2.value.frameGroupId
          && s1.value.orientation === s2.value.orientation
          // no point in transitioning to self however
          || s1 === s2;
      },
    );
  }
  protected override beforeTransition(_event: EntityTransition, to: EntityStateValue, owner: Entity): void {
    owner.ticksRemaining = to.ticks;
  }
}

export type Entity = {
  ticksRemaining: number,
  state: EntityStateMachine,
};

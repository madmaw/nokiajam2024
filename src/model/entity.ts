import { StateMachine } from 'base/state/machine';
import {
  type State,
  type TransitionApplicator,
} from 'base/state/types';

export const enum OrientationType {
  Omnidirectional,
  Lateral,
  Cardinal,
}

export const enum LateralDirection {
  Right = 1,
  Left,
}

export const enum LateralInputNeutral {
  Neutral = 0,
}

export type LateralInput = LateralInputNeutral | LateralDirection;

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
  Update = 1,
  Collision,
}

export type EntityTransitionUpdate = {
  type: EntityTransitionType.Update,
  frameComplete: boolean,
} & ({
  player: true,
  lateral: LateralInput,
  down: boolean,
  jump: boolean,
} | {
  player: false,
});

export type EntityTransitionCollision = {
  // TODO
  type: EntityTransitionType.Collision,
};

export type EntityTransition =
  | EntityTransitionUpdate
  | EntityTransitionCollision
  ;

export type EntityStateValue = {
  readonly name: string,
  readonly canvas: HTMLCanvasElement | OffscreenCanvas,
  readonly ticks: number[],
  // avoid obfuscation so we can reference this by name
  readonly ['orientation']: Orientation,
  readonly frameGroupId: string,
  readonly ['frameIndex']: number,
};

export type EntityState = State<EntityStateValue, EntityTransition, Entity>;
export class EntityStateMachine extends StateMachine<EntityStateValue, EntityTransition, Entity> {
  protected override beforeTransition(_event: EntityTransition, owner: Entity, to: EntityStateValue): void {
    owner.ticksRemaining = to.ticks[Math.random() * to.ticks.length | 0];
    console.log(_event, this.value.name, to.name, to.ticks);
  }
}

export type EntityTransitionApplicator = TransitionApplicator<EntityStateValue, EntityTransition, Entity>;

export type Entity = {
  ticksRemaining: number,
  state: StateMachine<EntityStateValue, EntityTransition, Entity>,
};

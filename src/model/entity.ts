export const enum LateralDirection {
  Left,
  Right,
}

export const enum EntityTransitionType {
  Tick,
  Walk,
}

export type EntityTransitionTick = {
  type: EntityTransitionType.Tick,
};

export type EntityTransitionWalk = {
  type: EntityTransitionType.Walk,
  direction: LateralDirection,
};

export type EntityTransition =
  EntityTransitionTick
  | EntityTransitionWalk;

export type EntityState = {
  readonly name: string,
  readonly canvas: HTMLCanvasElement | OffscreenCanvas,
  readonly ticks: number,
};

export type Entity = {
  ticksRemaining: number,
};

export const enum TransitionResult {
  TransitionAndAbort = 1,
  Continue,
}

export type TransitionApplicator<V, E, O> = (event: E, owner: O, targetValue: V) => TransitionResult;

export type Transition<V, E, O> = {
  readonly state: State<V, E, O>,
  readonly apply: TransitionApplicator<V, E, O>,
}

export type State<V, E, O> = {
  readonly value: V,
  readonly transitions: readonly Transition<V, E, O>[],
};

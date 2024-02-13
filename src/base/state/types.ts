export const enum TransitionResult {
  Transition = 1,
  Abort,
  TryNext,
}

export type TransitionApplicator<E, O> = (event: E, owner: O) => TransitionResult;

export type Transition<V, E, O> = {
  readonly state: State<V, E, O>,
  readonly apply: TransitionApplicator<E, O>,
}

export type State<V, E, O> = {
  readonly value: V,
  readonly transitions: readonly Transition<V, E, O>[],
};

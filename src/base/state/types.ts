export type Transition<V, E, O> = {
  readonly state: State<V, E, O>,
  readonly apply: (event: E, owner: O) => boolean,
}

export type State<V, E, O> = {
  readonly value: V,
  readonly transitions: readonly Transition<V, E, O>[],
};

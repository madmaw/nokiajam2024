import { type DefinedKeys } from 'base/types';

import {
  type State,
  type Transition,
} from './types';

export class TransitionBuilder<V, E, O> {
  constructor(
    readonly builder: StateBuilder<V, E, O>,
    readonly apply: (event: E, owner: O) => boolean,
  ) { }
}

export class StateBuilder<V, E, O, K extends DefinedKeys<V> = DefinedKeys<V>> {
  private readonly transitions: TransitionBuilder<V, E, O>[] = [];
  private readonly parents: StateBuilder<V, E, O>[] = [];
  private generatedState: State<Partial<V>, E, O> | undefined;
  knownChildren: StateBuilder<V, E, O>[] = [];

  constructor(
    private readonly value: Partial<V>,
    private readonly requiredKeys: K,
  ) {

  }

  addTransition(state: StateBuilder<V, E, O>, apply: (event: E, owner: O) => boolean): this {
    if (this.generatedState != null) {
      throw new Error('Cannot add transitions after state has been generated');
    }
    this.transitions.push(new TransitionBuilder(state, apply));
    return this;
  }

  addChild(value: Partial<V>): StateBuilder<V, E, O> {
    if (this.generatedState != null) {
      throw new Error('Cannot add children after state has been generated');
    }
    const state = new StateBuilder<V, E, O>(value, this.requiredKeys);
    this.knownChildren.push(state);
    state.parents.push(this);
    return state;
  }

  get partialState(): State<Partial<V>, E, O> {
    if (this.generatedState == null) {
      const parentStates = this.parents.map((parent) => parent.partialState);
      const myTransitions = this.transitions.map<Transition<Partial<V>, E, O>>(transition => {
        const {
          builder: {
            partialState,
          },
          apply,
        } = transition;
        return {
          state: partialState,
          apply,
        };
      });
      const value = parentStates.reduce(
        (value, { value: parentValue }) => ({
          ...value,
          ...parentValue,
        }),
        { ...this.value },
      );
      const parentTransitions = parentStates.flatMap(({ transitions }) => transitions);
      this.generatedState = {
        value,
        transitions: [
          ...myTransitions,
          ...parentTransitions,
        ],
      };
    }
    return this.generatedState;
  }

  get state(): State<V, E, O> {
    const state = this.partialState;
    const { value } = state;
    for (const key in this.requiredKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
      if (this.requiredKeys[key] === true && value[key as any as keyof V] === undefined) {
        throw new Error(`Missing required key ${key}`);
      }
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return state as State<V, E, O>;
  }

}

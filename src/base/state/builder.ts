import { type Mutable } from 'base/mutable';
import { type DefinedKeys } from 'base/types';

import {
  type State,
  type Transition,
  type TransitionResult,
} from './types';

export class TransitionBuilder<V, E, O> {
  constructor(
    readonly target: StateBuilder<V, E, O>,
    readonly apply: (event: E, owner: O) => TransitionResult,
    readonly priority: number,
  ) { }
}

type MutableState<V, E, O> = Mutable<State<V, E, O>>;

export class StateBuilder<V, E, O, K extends DefinedKeys<V> = DefinedKeys<V>> {
  private readonly transitions: TransitionBuilder<V, E, O>[] = [];
  private readonly parents: StateBuilder<V, E, O>[] = [];
  private readonly state: Partial<MutableState<V, E, O>>;
  knownChildren: StateBuilder<V, E, O>[] = [];

  constructor(
    readonly value: Partial<V>,
    private readonly requiredKeys: K,
  ) {
    this.state = {};
  }

  addTransition(target: StateBuilder<V, E, O>, apply: (event: E, owner: O) => TransitionResult, priority = 1): this {
    this.transitions.push(new TransitionBuilder(target, apply, priority));
    return this;
  }

  addTransitionAcrossAttributes<K extends keyof V>(
    target: StateBuilder<V, E, O>,
    apply: (event: E, owner: O, attributeValues: Record<K, V[K]>) => TransitionResult,
    attributes: ReadonlySet<K>,
    priority?: number,
  ): this {
    // find all our children with specified attributes populated, and all the target state with the attributes populated and create a transition for each
    const from = this.findChildrenWithAttributesSet(attributes);
    const to = target.findChildrenWithAttributesSet(attributes);
    // match up the specific values of those attributes and create a transition for each
    for (const fromState of from) {
      for (const toState of to) {
        if ([...attributes].every((attribute) => fromState.populatedValue[attribute] === toState.populatedValue[attribute])) {
          fromState.addTransition(toState, function (e, o) {
            return apply(
              e,
              o,
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              fromState.populatedValue as Record<K, V[K]>,
            );
          }, priority);
        }
      }
    }
    return this;
  }

  findChildrenWithAttributesSet<K extends keyof V>(attributes: ReadonlySet<K>): readonly StateBuilder<V, E, O>[] {
    const keys = Object.keys(this.value);
    const subtractedAttributes = new Set<K>(attributes);
    keys.forEach(function (key) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      subtractedAttributes.delete(key as K);
    });
    if (subtractedAttributes.size === 0) {
      return [this];
    }
    return this.knownChildren.flatMap((child) => child.findChildrenWithAttributesSet(subtractedAttributes));
  }

  createChild(value: Partial<V>): StateBuilder<V, E, O> {
    const state = new StateBuilder<V, E, O>(value, this.requiredKeys);
    this.knownChildren.push(state);
    state.parents.push(this);
    return state;
  }

  addChild(state: StateBuilder<V, E, O>): this {
    this.knownChildren.push(state);
    state.parents.push(this);
    return this;
  }

  private get populatedValue(): V {
    const parentValues = this.parents.map((parent) => parent.populatedValue);
    const value = parentValues.reduce(
      (value, parentValue) => ({
        ...value,
        ...parentValue,
      }),
      { ...this.value },
    );
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return value as V;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-return-this-type
  private get firstLeafChild(): StateBuilder<V, E, O> {
    if (this.knownChildren.length === 0) {
      return this;
    } else {
      return this.knownChildren[0].firstLeafChild;
    }
  }

  private get inheritedTransitions(): readonly TransitionBuilder<V, E, O>[] {
    const parentTransitions = this.parents.flatMap((parent) => parent.inheritedTransitions);
    return [
      ...parentTransitions,
      ...this.transitions,
    ];
  }

  private get populatedTransitions(): readonly Transition<V, E, O>[] {
    const orderedTransitions = [...this.inheritedTransitions].sort((a, b) => b.priority - a.priority);
    return orderedTransitions.map<Transition<V, E, O>>(transition => {
      const {
        target,
        apply,
      } = transition;
      const { state } = target.firstLeafChild;
      return {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        state: state as State<V, E, O>,
        apply,
      };
    });
  }

  private populateState(): State<V, E, O> {
    const value = this.populatedValue;
    for (const key in this.requiredKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
      if (this.requiredKeys[key] === true && value[key as any as keyof V] === undefined) {
        throw new Error(`Missing required key ${key}`);
      }
    }

    this.state.value = value;
    this.state.transitions = this.populatedTransitions;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.state as State<V, E, O>;
  }

  flatten(): readonly State<V, E, O>[] {
    if (this.knownChildren.length === 0) {
      return [this.populateState()];
    } else {
      return this.knownChildren.flatMap((child) => child.flatten());
    }
  }
}

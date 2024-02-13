import { StateBuilder } from 'base/state/builder';
import { type DefinedKeys } from 'base/types';

import {
  type Entity,
  type EntityStateValue,
  type EntityTransition,
} from './entity';

const requiredKeys: DefinedKeys<EntityStateValue> = {
  canvas: true,
  name: true,
  orientation: true,
  ticks: true,
  frameGroupId: true,
};

export class EntityStateBuilder extends StateBuilder<EntityStateValue, EntityTransition, Entity> {
  constructor(name: string) {
    super(
      {
        name,
      },
      requiredKeys,
    );
  }
}

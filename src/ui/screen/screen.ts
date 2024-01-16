import { type ComponentType } from 'react';
import { type MaybeWithInput } from 'ui/input';

export type ScreenProps = MaybeWithInput;

export type ScreenComponent = ComponentType<ScreenProps>;

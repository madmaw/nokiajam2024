import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { type TextAlignment } from 'ui/typography/text';

export type TextProps = PropsWithChildren<{ alignment?: TextAlignment }>;

export type Text = ComponentType<TextProps>;

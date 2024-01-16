import { type ButtonProps as OriginalButtonProps } from 'ui/button';

export type ButtonProps = Omit<OriginalButtonProps, 'Text'>;

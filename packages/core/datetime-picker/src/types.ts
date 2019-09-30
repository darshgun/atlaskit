export type Appearance = 'default' | 'subtle';
export type Spacing = 'compact' | 'default';

// Similiar to T = {...A, ...B}
export type Combine<First, Second> =
  // 1. Remove all overlapping types from First
  // 2. Add properties from Second
  Omit<First, keyof Second> & Second;

export type SelectProps = any;

export type PassThrough = React.AllHTMLAttributes<HTMLElement>;

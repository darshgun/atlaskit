import { Ref } from 'react';

export type Direction = 'entering' | 'exiting';

export interface EnteringMotionProps {
  /**
   * Children as function.
   * Will be passed `props` for you to hook up.
   * The `direction` arg can be used to know if the motion is entering or exiting.
   */
  children: (
    props: { className: string; ref: Ref<any> },
    direction: Direction,
  ) => JSX.Element;
}

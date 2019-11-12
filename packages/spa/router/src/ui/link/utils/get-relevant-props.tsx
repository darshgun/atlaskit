import pick from 'lodash.pick';

const GENERIC_PROPS = [
  'aria-label',
  'autoFocus',
  'className',
  'data-testid',
  'data-test-id',
  'disabled',
  'id',
  'onBlur',
  'onClick',
  'onFocus',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseUp',
  'tabIndex',
  'title',
  'style',
];

const ANCHOR_PROPS = [...GENERIC_PROPS, 'href', 'target'];

const BUTTON_PROPS = [...GENERIC_PROPS];

export const getPropsForElement = (elementType: 'a' | 'button', props: any) => {
  const allowedProps = elementType === 'a' ? ANCHOR_PROPS : BUTTON_PROPS;

  return pick(props, allowedProps);
};

/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import { colors } from '@atlaskit/theme';

const movesRight = keyframes`
  from {
    transform: none;
  }

  to {
    transform: translate3d(500px, 0, 0);
  }
`;

export const MovesRightBlock = (
  props: React.HTMLProps<HTMLDivElement> & {
    curve: string;
    duration: number;
  },
) => (
  <div
    css={{
      margin: '16px 0 32px',
      width: '150px',
      height: '150px',
      backgroundColor: colors.B300,
      borderRadius: '20px',
      animationName: `${movesRight}`,
      animationDuration: `${props.duration}ms`,
      animationTimingFunction: props.curve,
      animationIterationCount: 'infinite',
      cursor: props.onClick ? 'pointer' : 'default',
      ':hover': {
        backgroundColor: props.onClick ? colors.B400 : undefined,
      },
    }}
    {...props}
  />
);

import { gridSize } from '@atlaskit/theme/constants';

export const iframeCSS = ({ loading }: { loading: boolean }) =>
  ({
    border: 0,
    flex: '1 1 auto',
    height: `calc(100% - ${3 * gridSize()}px)`,
    visibility: loading ? 'hidden' : 'visible',
    width: '100%',
  } as const);

export const spinnerCSS = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  top: '11.25rem',
} as const;

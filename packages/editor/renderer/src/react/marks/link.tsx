import * as React from 'react';
import { colors } from '@atlaskit/theme';
import { EventHandlers, mediaSingleClassName } from '@atlaskit/editor-common';
import styled from 'styled-components';

import { getEventHandler } from '../../utils';

export const defaultMediaLinkOpacity = '0.8';

interface StyledAnchorProps {
  isMediaLink: boolean;
}

const StyledAnchor = styled.a`
  ${(props: StyledAnchorProps) =>
    props.isMediaLink
      ? `pointer-events: none;
         cursor: default;
         display: block;`
      : ''}
  color: ${colors.B400};

  & > .${mediaSingleClassName} {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    ${(props: StyledAnchorProps) =>
      props.isMediaLink
        ? `pointer-events: all;
           cursor: pointer;`
        : ''}

  }

  &:hover {
    & > .${mediaSingleClassName} {
      opacity: ${defaultMediaLinkOpacity};
    }

    color: ${colors.B300};
    text-decoration: underline;
  }
`;

export default function Link(
  props: {
    children?: any;
    href: string;
    target?: string;
    eventHandlers?: EventHandlers;
    isMediaLink?: boolean;
  } & React.Props<any>,
) {
  const { href, target, eventHandlers } = props;

  const anchorProps: any = {
    href,
    target,
    title: href,
  };

  if (target === '_blank') {
    anchorProps.rel = 'noreferrer noopener';
  }

  const handler = getEventHandler(eventHandlers, 'link');

  return (
    <StyledAnchor
      onClick={e => {
        if (handler) {
          handler(e, href);
        }
      }}
      {...anchorProps}
      isMediaLink={props.isMediaLink}
    >
      {props.children}
    </StyledAnchor>
  );
}

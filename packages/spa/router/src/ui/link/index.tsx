import React, { createElement, forwardRef } from 'react';
import { createPath } from 'history';

import { LinkProps } from '../../common/types';
import { RouterSubscriber } from '../../controllers';

import {
  handleNavigation,
  getPropsForElement,
  getValidLinkType,
} from './utils';

const Link = forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      target = '_self',
      replace = false,
      href = '',
      to = '',
      onClick = undefined,
      type: linkType = 'a',
      ...rest
    },
    ref,
  ) => {
    return (
      <RouterSubscriber>
        {({ location }, { push, replace: replaceAction }) => {
          const validLinkType = getValidLinkType(linkType);
          const linkProps = getPropsForElement(validLinkType, rest);
          const linkTargetProp = href || to || '';
          const linkDestination =
            typeof linkTargetProp === 'object'
              ? createPath(linkTargetProp)
              : linkTargetProp;

          const routerActions = { push, replace: replaceAction };

          const handleLinkPress = (e: any) =>
            handleNavigation(e, {
              onClick,
              target,
              replace,
              routerActions,
              href: linkDestination,
              location,
            });

          return createElement(
            validLinkType,
            {
              ...linkProps,
              href: linkDestination,
              target,
              onClick: handleLinkPress,
              onKeyDown: handleLinkPress,
              ref,
            },
            children,
          );
        }}
      </RouterSubscriber>
    );
  },
);

Link.displayName = 'Link';

export default Link;

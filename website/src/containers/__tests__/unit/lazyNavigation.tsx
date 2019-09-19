import React from 'react';
import { render } from '@testing-library/react';

import Groups from '../../DesktopNav/Groups';
import DesktopNav from '../../DesktopNav';
import MobileNav from '../../MobileNav';
// TODO: There is a caveat here, an unhandled promise rejection is thrown because items for getDirectories is returning undefined. It is really difficult to mock a full navigation with items.
// Cannot read property 'Symbol(Symbol.iterator)' of undefined
describe('Desktop navigation', () => {
  test('should render fallback', async () => {
    // @ts-ignore:  Type '{}' is missing the following properties from type 'RouteComponentProps<{}, StaticContext, any>': history, location, match.
    const { findAllByAltText } = await render(<DesktopNav />);
    expect(() => findAllByAltText('Atlaskit logo')).toBeTruthy();
  });
});

describe('Mobile navigation', () => {
  test('should render fallback', async () => {
    const { findAllByLabelText } = await render(<MobileNav />);
    expect(() => findAllByLabelText('Open navigation')).toBeTruthy();
  });
});

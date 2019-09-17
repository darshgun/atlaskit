import React from 'react';
import { TableBodyRow } from '../../../styled/TableRow';
import { shallow, ShallowWrapper } from 'enzyme';

describe('TableRow', () => {
  let shallowWrapper: ShallowWrapper;

  describe('on rendering with highlighted prop', () => {
    beforeEach(() => {
      shallowWrapper = shallow(<TableBodyRow isHighlighted={true} />);
    });

    it('should render with required background color', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });
  });

  describe('on rendering without highlighted prop', () => {
    beforeEach(() => {
      shallowWrapper = shallow(<TableBodyRow isHighlighted={false} />);
    });

    it('should render with required background color', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });
  });
});

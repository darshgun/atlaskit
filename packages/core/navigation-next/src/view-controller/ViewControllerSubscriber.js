// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewController from './ViewController';

type Props = {|
  children: ViewController => Node,
|};

const to = [ViewController];

const ViewControllerSubscriber = (props: Props) => (
  <Subscribe to={to} {...props} />
);

export default ViewControllerSubscriber;

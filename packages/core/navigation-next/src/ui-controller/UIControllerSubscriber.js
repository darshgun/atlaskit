// @flow

import React from 'react';
import { Subscribe } from 'unstated';

import UIController from './UIController';
import type { UIControllerSubscriberProps } from './types';

const to = [UIController];

const UIControllerSubscriber = ({ children }: UIControllerSubscriberProps) => (
  <Subscribe to={to}>{children}</Subscribe>
);

export default UIControllerSubscriber;

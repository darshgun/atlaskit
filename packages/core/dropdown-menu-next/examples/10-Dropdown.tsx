import React from 'react';
import Dropdown from '../src';
import { DropdownTrigger, MenuList, MenuItem } from '../src';
import { Placement } from '@atlaskit/popper';

export default () => {
  const [idx, setIdx] = React.useState(0);
  const positions: Array<Placement> = [
    'bottom-end',
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ];
  const setPosition = () => {
    if (idx !== positions.length - 1) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
    }
  };
  return (
    <div style={{ margin: '20px 50%', width: '200px' }}>
      Default Dropdown
      <Dropdown>
        <DropdownTrigger text="Default Dropdown" />
        <MenuList>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuList>
      </Dropdown>
      <br />
      <br />
      <br />
      start open Dropdown with position change
      <button onClick={setPosition}>Change Position</button>
      <br />
      <br />
      <br />
      <Dropdown defaultIsOpen position={positions[idx]} minWidth="150px">
        <DropdownTrigger text="Default Open" />
        <MenuList>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuList>
      </Dropdown>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      Manage State with renderProps
      <Dropdown>
        {({ toggleOpen, state }) => (
          <React.Fragment>
            <DropdownTrigger>
              <a onClick={toggleOpen}>
                I am {state.isOpen ? 'open' : 'closed'}
              </a>
            </DropdownTrigger>
            <MenuList>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
              <MenuItem>Item 3</MenuItem>
            </MenuList>
          </React.Fragment>
        )}
      </Dropdown>
    </div>
  );
};

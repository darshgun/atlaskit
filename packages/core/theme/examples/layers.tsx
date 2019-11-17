import React from 'react';
import { layers } from '../src';

export default () => {
  return (
    <div>
      {Object.keys(layers).map(name => (
        <div key={name}>{`layers.${name}() // ${layers[name]()}`}</div>
      ))}
    </div>
  );
};

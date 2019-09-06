import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ReactIntl from 'react-intl';

type Dependency = {
  [key: string]: DependencyDetails;
};

type DependencyDetails = {
  name: string;
  exists: boolean;
};

export const resolveDependencies = () => {
  const peerDependencies: Dependency = {
    react: {
      name: 'React',
      exists: !!React,
    },
    'react-dom': {
      name: 'ReactDOM',
      exists: !!ReactDOM,
    },
    'styled-components': {
      name: 'styled-components',
      exists: !!styled,
    },
    'react-intl': {
      name: 'react-intl',
      exists: !!ReactIntl,
    },
  };

  const missingDependencies = Object.keys(peerDependencies).filter(
    packageKey => {
      return !peerDependencies[packageKey].exists;
    },
  );

  if (missingDependencies.length > 0) {
    const dependencyNames = missingDependencies.map(
      dep => peerDependencies[dep].name,
    );
    const message = `Atlassian switcher: Could not find ${dependencyNames.join(
      ', ',
    )}. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer.`;
    throw new Error(message);
  }
};

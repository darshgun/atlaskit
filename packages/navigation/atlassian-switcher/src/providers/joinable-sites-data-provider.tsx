import React from 'react';

import asDataProvider, {
  ResultComplete,
  Status,
  ProviderResult,
} from './as-data-provider';

const emptyJoinableSites: ResultComplete<any> = {
  status: Status.COMPLETE,
  data: [],
};

export const JoinableSitesProvider = ({
  disabled,
  fetchJoinableSites,
  children,
}: {
  disabled: boolean;
  fetchJoinableSites;
  children: (joinableSites: ProviderResult<any>) => React.ReactNode;
}) => {
  if (disabled) {
    return children(emptyJoinableSites);
  }

  const JoinableSitesProvider = asDataProvider(
    'joinableSites',
    fetchJoinableSites,
  );
  return <JoinableSitesProvider>{children}</JoinableSitesProvider>;
};

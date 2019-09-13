/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, cloneElement } from 'react';
import Button from '@atlaskit/button';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StrideIcon,
  StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance } from '../src';
import { Block, RetryContainer } from '../examples-utils';

const logos = [
  <BitbucketIcon size="xlarge" />,
  <ConfluenceIcon size="xlarge" />,
  <JiraCoreIcon size="xlarge" />,
  <JiraIcon size="xlarge" />,
  <JiraServiceDeskIcon size="xlarge" />,
  <JiraSoftwareIcon size="xlarge" />,
  <OpsGenieIcon size="xlarge" />,
  <StrideIcon size="xlarge" />,
  <StatuspageIcon size="xlarge" />,
];

export default () => {
  const [numOfChildren, setNumOfChildren] = useState(9);
  const [size, setSize] = useState<any>('medium');

  return (
    <div>
      <div css={{ textAlign: 'center', '> *': { margin: '2px' } }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 50].map(num => (
          <Button
            key={num}
            isSelected={num === numOfChildren}
            onClick={() => {
              setSize(num > 9 ? 'small' : 'medium');
              setNumOfChildren(num);
            }}
          >
            {num}
          </Button>
        ))}
      </div>

      <RetryContainer key={numOfChildren}>
        <ul
          css={{
            display: 'flex',
            maxWidth: '474px',
            flexWrap: 'wrap',
            padding: 0,
            justifyContent: 'flex-start',
            margin: '16px auto !important',
            div: { margin: '0' },
          }}
        >
          <StaggeredEntrance columns="responsive">
            {Array(numOfChildren)
              .fill(undefined)
              .map((_, index) => (
                <FadeIn key={index}>
                  {props => (
                    <li
                      {...props}
                      css={{ display: 'block', padding: 0, margin: '4px' }}
                    >
                      <Block appearance={size}>
                        {cloneElement(logos[index % logos.length], {
                          size: numOfChildren > 9 ? 'small' : 'xlarge',
                        })}
                      </Block>
                    </li>
                  )}
                </FadeIn>
              ))}
          </StaggeredEntrance>
        </ul>
      </RetryContainer>
    </div>
  );
};

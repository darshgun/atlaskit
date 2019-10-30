// @flow
import React from 'react';
import styled from 'styled-components';
import stringRaw from 'string-raw';
import { AkCodeBlock } from '@atlaskit/code';

/*
 * Tag function to render a code block, e.g. code`console.log("hello world")`
 * Template expressions aren't yet supported, and likely never will be.
 */
export default function code(
  // Tagged Template Literal support is still WIP for flow: https://github.com/facebook/flow/issues/2616
  sources: any,
  ...substitutions: any[]
) {
  let source = stringRaw(sources, substitutions);
  const highlightRaw = /^highlight=(.*)/.exec(source);
  const highlight =
    highlightRaw && highlightRaw[1] ? highlightRaw[1] : undefined;
  source = source.replace(/^highlight=(.*)/, ''); // Remove highlight if it's defined on the first line
  source = source.replace(/^(\s*\n)+/g, ''); // Remove leading newlines
  source = source.replace(/(\n\s*)+$/g, ''); // Remove trailing newlines

  return (
    <CodeWrapper>
      <AkCodeBlock language="javascript" text={source} highlight={highlight} />
    </CodeWrapper>
  );
}

const CodeWrapper = styled.div`
  display: block;
  margin-top: 8px;
  overflow: auto;
  max-width: calc(100vw - 4rem);
`;

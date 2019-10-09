import { createSynchronyProvider } from '@atlaskit/synchrony-test-helpers';
import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-document';

export default function Example() {
  const collabProvider = createSynchronyProvider();

  return FullPageExample({
    defaultValue: exampleDocument,
    collabEditProvider: collabProvider,
  });
}

import { default as FullPageExample } from './5-full-page';
import { getXProductExtensionProvider } from '../example-helpers/fake-x-product-extensions';

export default function Example() {
  return FullPageExample({
    extensionProviders: [getXProductExtensionProvider()],
  });
}

import { CollabEditProvider } from '@atlaskit/editor-common';
import createSynchronyProvider from './synchrony-provider';
import { createMockCollabEditProvider } from './mock-collab-provider';

export async function createCollabEditProvider(userId?: string, defaultDoc?: string): Promise<CollabEditProvider> {
  if (SYNCHRONY_URL) {
    const synchronyProvider = await createSynchronyProvider(SYNCHRONY_URL);
    if (synchronyProvider) {
      return synchronyProvider;
    }
  }

  return createMockCollabEditProvider(userId, defaultDoc);
}

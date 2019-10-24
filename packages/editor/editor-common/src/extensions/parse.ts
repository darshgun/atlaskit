import { ExtensionProvider } from './types';
import {
  MenuItem,
  filterByCapability,
  runInAllExtensionProviders,
  groupBy,
} from './helpers';

type MappedExtensionPoints = {
  quickInsert: { [key: string]: MenuItem };
  insertMenu: { [key: string]: MenuItem };
};

export default async (extensionProviders: ExtensionProvider[]) => {
  const extensionsPoints: MappedExtensionPoints = {
    quickInsert: {} as never,
    insertMenu: {} as never,
  };

  await extensionProviders.forEach(async provider => {
    const extensions = await provider.getExtensions();
    extensions.forEach(extension => {
      Object.assign(
        extensionsPoints.quickInsert,
        groupBy(filterByCapability(extension, 'quickinsert'), 'key'),
      );
      Object.assign(
        extensionsPoints.insertMenu,
        groupBy(filterByCapability(extension, 'insertmenu'), 'key'),
      );
    });
  });

  return {
    extensionsPoints,
    actions: runInAllExtensionProviders(extensionProviders),
  };
};

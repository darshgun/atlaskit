import { ExtensionKey, Module, ESModule } from './types/extension-manifest';

export const getExtensionKeyAndNodeKey = (extensionKey: ExtensionKey) => {
  const [extKey, nodeKey = 'default'] = extensionKey.split(':');
  return [extKey, nodeKey];
};

export const resolveImport = <T>(obj: Module<T>) => {
  return obj && (obj as ESModule<T>).__esModule
    ? (obj as ESModule<T>).default
    : (obj as T);
};

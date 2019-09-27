export type PkgJson = {
  name: string;
  version: string;
  [allOtherFields: string]: any;
};

export type PackageInfo = {
  dir: string;
  name: string;
  config: PkgJson;
  relativeDir: string;
  isTypeScript: boolean;
  isTypeScriptCLI: boolean;
  isBabel: boolean;
  isFlow: boolean;
  isESLint: boolean;
  isKarma: boolean;
  isBrowserStack: boolean;
  isStylelint: boolean;
  isWebdriver: boolean;
  isVisualRegression: boolean;
  isBrowserPackage: boolean;
};

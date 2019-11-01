// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getPackagesInfo(cwd, opts) {
  const project = await bolt.getProject({ cwd });
  const packages = await bolt.getWorkspaces({ cwd, ...opts });

  return Promise.all(packages.map(pkg => getPackageInfo(pkg, project)));
}

async function getPackageInfo(pkg, project) {
  // eslint-disable-next-line no-undef
  const resolvedProject = project || (await bolt.getProject({ cwd }));
  const relativeDir = path.relative(resolvedProject.dir, pkg.dir);
  const srcExists = await exists(path.join(pkg.dir, 'src'));
  const tsConfigExists = await exists(path.join(pkg.dir, 'tsconfig.json'));
  const tsConfigCliExists = await exists(
    path.join(pkg.dir, 'build', 'cli', 'tsconfig.json'),
  );
  const testBrowserExists = await exists(path.join(pkg.dir, '__tests-karma__'));
  const testWebdriverExists = await exists(
    path.join(pkg.dir, 'src', '__tests__', 'integration'),
  );
  const testVisualRegressionExists = await exists(
    path.join(pkg.dir, 'src', '__tests__', 'visual-regression'),
  );

  const isBrowserPackage = !relativeDir.startsWith('build');
  const isWebsitePackage = relativeDir.startsWith('website');

  const allDependencies = Object.assign(
    {},
    pkg.config.dependencies,
    pkg.config.devDependencies,
    pkg.config.peerDependencies,
  );

  const hasKarmaDep = !!allDependencies.karma;

  const isTypeScriptCLI = tsConfigCliExists;
  const isTypeScript = tsConfigExists && !isWebsitePackage; // The website does not need to be built

  const isBabel = srcExists && !isTypeScript && !isWebsitePackage;
  const isFlow = isBabel || isWebsitePackage;
  const isESLint = srcExists || isWebsitePackage || !isBrowserPackage;

  const isKarma = testBrowserExists || hasKarmaDep;
  const isBrowserStack = isKarma;
  const isStylelint = srcExists && isBrowserPackage;
  const isWebdriver = testWebdriverExists;
  const isVisualRegression = testVisualRegressionExists;

  return {
    dir: pkg.dir,
    name: pkg.name,
    config: pkg.config,
    relativeDir,
    isTypeScript,
    isTypeScriptCLI,
    isBabel,
    isFlow,
    isESLint,
    isKarma,
    isBrowserStack,
    isStylelint,
    isWebdriver,
    isVisualRegression,
    isBrowserPackage,
  };
}

const TOOL_NAME_TO_FILTERS /*: { [key: string]: (pkg: Object) => boolean } */ = {
  typescript: pkg => pkg.isTypeScript,
  typescriptcli: pkg => pkg.isTypeScriptCLI,
  babel: pkg => pkg.isBabel,
  flow: pkg => pkg.isFlow,
  eslint: pkg => pkg.isESLint,
  karma: pkg => pkg.isKarma,
  browserstack: pkg => pkg.isBrowserStack,
  stylelint: pkg => pkg.isStylelint,
  webdriver: pkg => pkg.isWebdriver,
  vr: pkg => pkg.isVisualRegression,
};

async function getPackageDirsForTools(cwd) {
  const packages = await getPackagesInfo(cwd);
  const toolGroups = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(TOOL_NAME_TO_FILTERS).map(toolName => {
    toolGroups[toolName] = packages
      .filter(TOOL_NAME_TO_FILTERS[toolName])
      .map(pkg => pkg.relativeDir);
  });

  return toolGroups;
}

module.exports = {
  getPackageInfo,
  getPackagesInfo,
  getPackageDirsForTools,
  TOOL_NAME_TO_FILTERS,
};

// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getPackagesInfo(cwd /*:string*/, opts /*: ?Object */) {
  const project = await bolt.getProject({ cwd });
  const packages = await bolt.getWorkspaces({ cwd, ...opts });

  return Promise.all(packages.map(pkg => getPackageInfo(pkg, project)));
}

async function getPackageInfo(pkg /*: Object */, project /*: Object*/) {
  const cwd = process.cwd();
  const resolvedProject = project || (await bolt.getProject({ cwd }));
  const relativeDir = path.relative(resolvedProject.dir, pkg.dir);
  const srcExists = await exists(path.join(pkg.dir, 'src'));
  const tsConfigExists = await exists(path.join(pkg.dir, 'tsconfig.json'));
  const tsBuildConfigExists = await exists(
    path.join(pkg.dir, 'build', 'tsconfig.json'),
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

  const runTypecheck = tsConfigExists;
  const runTypeScriptBuild = tsBuildConfigExists;

  const runBabel = srcExists && !runTypecheck && !isWebsitePackage;
  const runFlow = runBabel || isWebsitePackage;
  const runESLint = srcExists || isWebsitePackage || !isBrowserPackage;

  const runKarma = testBrowserExists || hasKarmaDep;
  const runBrowserStack = runKarma;
  const runStyleLint = srcExists && isBrowserPackage;
  const runWebdriver = testWebdriverExists;
  const runVisualRegression = testVisualRegressionExists;

  return {
    dir: pkg.dir,
    name: pkg.name,
    config: pkg.config,
    relativeDir,
    runTypeScriptBuild,
    runTypecheck,
    runBabel,
    runFlow,
    runESLint,
    runKarma,
    runBrowserStack,
    runStyleLint,
    runWebdriver,
    runVisualRegression,
    isBrowserPackage,
  };
}

const TOOL_NAME_TO_FILTERS /*: { [key: string]: (pkg: Object) => boolean } */ = {
  typecheck: pkg => pkg.runTypecheck,
  typescriptbuild: pkg => pkg.runTypeScriptBuild,
  babel: pkg => pkg.runBabel,
  flow: pkg => pkg.runFlow,
  eslint: pkg => pkg.runESLint,
  karma: pkg => pkg.runKarma,
  browserstack: pkg => pkg.runBrowserStack,
  stylelint: pkg => pkg.runStyleLint,
  webdriver: pkg => pkg.runWebdriver,
  vr: pkg => pkg.runVisualRegression,
};

module.exports = {
  getPackageInfo,
  getPackagesInfo,
  TOOL_NAME_TO_FILTERS,
};

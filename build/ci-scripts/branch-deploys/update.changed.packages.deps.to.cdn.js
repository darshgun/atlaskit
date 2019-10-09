/**
 * This script is used during branch deploys to update all the package.json's of changed packages
 * so that if they have any dependencies on other changed packages, they also point to the branch
 * deployed version.
 *
 * It also updates the version of each package.json to a unique pre-release version to prevent a yarn resolution bug where it incorrectly resolves
 * the actual version of the package and our branch deployed version to the same yarn.lock entry if they are both added at the same time as a result of
 * them both being a transitive dependency.
 * That issue seems to cause https://github.com/yarnpkg/yarn/issues/2629 & https://github.com/yarnpkg/yarn/issues/6312 as well.
 */

const bolt = require('bolt');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

const { CHANGED_PACKAGES, BITBUCKET_COMMIT } = process.env;
if (!CHANGED_PACKAGES) {
  console.error(
    'Expected to find list of changed packages in $CHANGED_PACKAGES',
  );
  console.error('Exiting');
  process.exit(1);
}
if (!BITBUCKET_COMMIT) {
  console.error('Expected to find current commit in $BITBUCKET_COMMIT');
  console.error('Exiting');
  process.exit(1);
}

const changedPackages = JSON.parse(CHANGED_PACKAGES);
const commit = BITBUCKET_COMMIT.substr(0, 12);

const getExpectedUrl = (pkgName, pkgVersion, commit) => {
  const shortPkgName = pkgName.replace('@atlaskit/', 'atlaskit-');
  // pkgVersion may or may not contain the commit pre-release version at this stage, so we normalise
  const baseVersion = pkgVersion.replace(`-${commit}`, '');
  const normalisedVersion = `${baseVersion}-${commit}`;
  return `https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/${commit}/dists/${shortPkgName}-${normalisedVersion}.tgz`;
};

bolt.getWorkspaces().then(workspaces => {
  const changedPackagesInfo = workspaces.filter(ws =>
    changedPackages.includes(path.relative(cwd, ws.dir)),
  );

  changedPackagesInfo.forEach(pkg => {
    const packageJsonPath = path.join(pkg.dir, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath));

    pkgJson.version = `${pkg.config.version}-${commit}`;
    console.log(`Updating version of ${pkgJson.name} to ${pkgJson.version}`);

    Object.entries(pkgJson.dependencies).forEach(([depName]) => {
      let cpInfo = changedPackagesInfo.find(
        changedPkg => changedPkg.name === depName,
      );

      if (cpInfo) {
        const depVersion = cpInfo.config.version;
        const expectedUrl = getExpectedUrl(depName, depVersion, commit);
        pkgJson.dependencies[depName] = expectedUrl;
        console.log(
          `Updating dep of ${pkgJson.name}: ${depName} - ${expectedUrl}`,
        );
      }
    });

    const pkgJsonStr = JSON.stringify(pkgJson, null, 2);
    console.log(`Updating package.json at ${packageJsonPath}`);
    fs.writeFileSync(packageJsonPath, pkgJsonStr);
  });
});

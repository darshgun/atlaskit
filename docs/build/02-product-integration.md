# Product Integration

As a shared library that is heavily used by a wide range of Atlassian products, it is essential that we can easily integrate Atlassian frontend components and packages into products both before and after they are officially released.

Integrating in-development changes to components before they are released allows the changes to be validated and tested in products as part of the development phase rather than the post-release phase. This leads to more robust components that have less defects, more confidence in upgrading changes from products and less overall cost to the change.

Combined with our [Scheduled Release Workflow](release-workflow), this allows us to ship stable releases of our components by forcing us to tackle any integration challenges up-front rather than letting them fall by the wayside.

There are a number of different ways that we can achieve integrate Atlassian frontend changes into product:

- [Locally linking into products](#local-linking) - Linking changes on your local machine to a product repo
- [Branch deploys](#branch-deploys) - Building and deploying the changes in your branch to the cloud where they can then be installed in products from a URL
- [Product CI integration](#product-ci-integration) - Automated branch deploys in products that runs their CI and reports the status back to the original AF branch

<a id="local-linking"></a>

## Locally linking into products

Linking changes you've made on your local machine to another repo allows you to test your changes rapidly in real-time without having to wait for a full branch build every time you wish to make a change.

It's recommended to use this approach when you need to develop a component directly inside a product or to debug an issue that can only be reproduced in that product.

Read the [Local linking guide][linking-with-products] to learn how to do this.

<a id="branch-deploys"></a>

## Branch deploys

Branch deploys are a way to publish changes to all packages you've made in your development branch to s3 as a published package bundle that can then be installed in a product via traditional `yarn` / `bolt` / `npm` commands.

Read more about branch deploys [here][branch-deploys].

<a id="product-ci-integration"></a>

## Product CI Integration

Product CI integration takes [branch deploys][branch-deploys] one step further by automatically creating a branch in product repos that contains an installed version of your branch deployed packages. Product CI is then automatically triggered and run on these branches and the result is linked back to the original Atlassian Frontend commit that was branch deployed.

In short, this allows us to [run product tests against Atlaskit PRs](https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/966233273/Run+product+tests+against+Atlaskit+PR+s).

The process is roughly as follows:

1. New commits are pushed for an AK branch
2. This triggers a [branch deploy integrator][branch-deploy-integrator] bamboo build for each supported product
3. The build:

   - Creates a new branch in product (or re-uses an existing branch) with the name `'atlaskit-branch-deploy-<ak-branch-name>'`
   - Merges latest master into the branch and resets package.json/yarn.lock back to their original state
   - Waits for the AK branch deploy to finish and then installs it
   - Pushes the branch and triggers product CI builds manually for cases when they don't trigger automatically (e.g. confluence PR builds)

4. The [ak-product-ci-integrator][integrator-service] service sends the result of the product CI build
   back to the original AK commit as a build status.

See the [branch deploy integrator bamboo template docs][branch-deploy-integrator] for more detailed information on how this works.

### Important information

There are a few important things to note about this process:

- The product CI build statuses do not block PRs from being landed. This is an intentional choice to prevent unnecessary friction while the builds are not completely stable. We may revisit this decision later.
- Failed product CI build statuses are denoted via the 'STOPPED' status rather than 'FAILED'. This makes it easier to not block PRs from merging and provides a way of distinguishing a build failure caused by an Atlaskit build versus a product build.
- Product CI integration is now enabled on all branches by default rather than only develop, release candidates and branches prefixed with 'risky'.
- For product CI build results to provide optimal value, the base branch of your branch (`develop` or `master`) should be green, otherwise your branch may incorporate build failures from the base branch. We are working towards making these base branches more stable in the future to mitigate this.

#### Relevant sources:

- [branch deploy integrator bamboo templates][branch-deploy-integrator]
- [branch-deploy-product-integrator package][integrator-package]
- [ak-product-ci-integrator service][integrator-service]

[linking-with-products]: https://atlaskit.atlassian.com/docs/build/local-linking-with-products
[branch-deploys]: https://atlaskit.atlassian.com/docs/build/branch-deploys
[release-workflow]: https://atlaskit.atlassian.com/docs/build/release-workflow
[branch-deploy-integrator]: https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/services/bamboo-templates/branch-deploy-integrator/README.md
[integrator-package]: https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/packages/monorepo-tooling/branch-deploy-product-integrator
[integrator-service]: https://bitbucket.org/atlassian/ak-product-ci-integrator/src/HEAD/

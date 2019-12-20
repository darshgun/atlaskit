# Bamboo-templates

Some of our builds will need bamboo-templates this is the place for them to go.
Obviously none of the templates are actually published to npm.
Please make sure you use logical grouping of your plans and add something to this README.md.

## Groovy plan templates for DUMMIES

Many, Many, Many ShipIts ago, someone build groovy plan templates for Bamboo.
To my knowledge this feature never made it to actual customers but a lot of Atlassian teams still use it.
The groovy templates have been replaced by full on Java specs but those are a bit harder to work with.
\*If you want to use Java specs, please don't put them in this package. Instead create a seperate repo for it
and add a link to this README.md for posterity.

### Working with Groovy templates

The easiest way to create a groovy template is by creating your plan on bamboo using the web ui.
Once you're happy with your plan follow these steps:

1. Go to the root of the plan, for example: https://engservices-bamboo.internal.atlassian.com/browse/ABDPI-BDIG
2. Click the "Actions" button in the right top corner
3. Click "View As Plan Template"
4. Tada, great success!

Now that you have your groovy check it in some where and setup a plan with a: "Plan template execution" task and point it to your groovy([example](https://engservices-bamboo.internal.atlassian.com/build/admin/edit/editBuildTasks.action?buildKey=ABDPI-BDIG-JOB1))

Everytime the "Plan template execution" runs it'll generate your plan in the location you used to have your "development" plan.
The plan is overriden everytime everytime the plan template is executed.

When you wanna make changes to your plan I recommend making them on the generated plan and then viewing as plan template again.
Any manual changes you've made to the plan will be blown away when the "Plan Template execution" runs again.

#### Validating your changes

Bamboo can validate your plan before it's merged. This is done on all branches that are not master.
To reduce build noise on `atlassian-frontend` I've not made branch creation automatic.
So if you're making a template change you will have to manually create a plan branch for your branch here:
https://engservices-bamboo.internal.atlassian.com/branchStatus/

#### Advanced mode: Shortcuts

You can sort of create re-usable code by using shortcuts, see the shortcuts file in the branch-deploy-integrator directory for an example.
Not everything is allowed in there but bamboo will yell it you if you get it wrong.
Just look at how branch-deploy-integrator does things and you'll be able to figure it out.

# Branch-deploy-integrator

The builds that deploy ~atlaskit~ atlassian-frontend branch deploys into products.
We deploy these plans to https://engservices-bamboo.internal.atlassian.com/browse/ABDPI.

## Adding a new product

1. Copy-pasta a existing product's groovy file
2. Update the product names in the groovy file
3. update the file with the right settings for the branch-deploy-integrator CLI
4. Check the file in and push it
5. Add a "Plan Template Execution" to https://engservices-bamboo.internal.atlassian.com/build/admin/edit/editBuildTasks.action?buildKey=ABDPI-BDIG-JOB1. Make sure it points to your new groovy.
6. Boom done, if you wanna test it while in development set the jobs running strategy to: "Execute on both Master and Branches". But make sure to switch this back to "Execute on Master, validate only on Branches" when you are done.

fin

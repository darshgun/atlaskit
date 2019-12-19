#! /bin/bash

branch_name=${bamboo_planRepository_branch}
if [ "$branch_name" != "master" ]; then
    git remote set-url origin ${bamboo_planRepository_2_repositoryUrl}
    # Prune so that we get rid of stale refs to deleted branches
    # Otherwise the integrator will fail
    git fetch origin --prune

    yarn global add @atlaskit/branch-deploy-product-integrator@2.0.1

    if [ "$SKIP_INTEGRITY_CHECK" == "true" ]; then
        PRODUCT_CI_USERNAME="$bamboo_build_doctor_username" PRODUCT_CI_PASSWORD="$bamboo_build_doctor_password" branch-deploy-product-integrator push ${bamboo_planRepository_branch} ${bamboo_planRepository_revision} --packageEngine ${PACKAGE_ENGINE} --cmd ${PACKAGE_ENGINE_CMD} --productCiPlanUrl ${PRODUCT_CI_PLANURL} -- --skip-integrity-check 
    else
        PRODUCT_CI_USERNAME="$bamboo_build_doctor_username" PRODUCT_CI_PASSWORD="$bamboo_build_doctor_password" branch-deploy-product-integrator push ${bamboo_planRepository_branch} ${bamboo_planRepository_revision} --packageEngine ${PACKAGE_ENGINE} --cmd ${PACKAGE_ENGINE_CMD} --productCiPlanUrl ${PRODUCT_CI_PLANURL} 
    fi
else
echo "Current branch is master. Not going to branch deploy."
fi
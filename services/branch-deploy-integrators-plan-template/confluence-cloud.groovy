plan(key:'ABDICC',name:'Confluence Cloud Atlaskit Branch Deploy Integrator',
    description:'Creates branches on Confluence Cloud pulling in Atlaskit branch deploys to give Atlaskit build results on their PRs. **NOTE**: Master is disabled but every other branch is enabled',
    enabled:'false') {
    createBranchDeployIntegrator(key: 'BDICC', productName: 'Confluence Cloud', repo: 'confluence-frontend')
    branchMonitoring() {
        createBranch(matchingPattern:'risky-.*|develop|release-candidate.*')
        inactiveBranchCleanup(periodInDays:'14')
        deletedBranchCleanup(periodInDays:'7')
    }
    dependencies(triggerForBranches:'true')
    planMiscellaneous() {
        hungBuildKiller(enabled:'true')
        planOwnership(owner:'mdejongh')
    }
    permissions() {
        user(name:'mdejongh',permissions:'read,write,build,clone,administration')
    }
}

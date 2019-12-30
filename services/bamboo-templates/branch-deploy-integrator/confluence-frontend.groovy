plan(key:'ABDICC',name:'confluence-frontend Atlaskit Branch Deploy Integrator',
    description:'Creates branches on confluence-frontend pulling in Atlaskit branch deploys to give Atlaskit build results on their PRs. **NOTE**: Master is disabled but every other branch is enabled',
    enabled:'false') {
    createBranchDeployIntegrator(
        sourceRepo: 'Atlaskit-MK-2',
        productRepo: 'confluence-frontend',
        productCiPlanUrl: 'https://confluence-cloud-bamboo.internal.atlassian.com/rest/api/latest/plan/CONFMICRO-CFCPB',
        dockerContainer: 'docker.atl-paas.net/sox/confluence/confluence-frontend-agent:latest',
        packageEngine: 'bolt',
        integratorCmd: 'add',
        skipIntegrityCheck: false)
    branchMonitoring() {
        createBranch()
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

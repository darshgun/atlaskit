plan(key:'ABDIJC',name:'jira-frontend Atlaskit Branch Deploy Integrator',
    description:'Creates branches on jira-frontend pulling in Atlaskit branch deploys to give Atlaskit build results on their PRs. **NOTE**: Master is disabled but every other branch is enabled',
    enabled:'false') {
    
    createBranchDeployIntegrator(
        sourceRepo: 'Atlaskit-MK-2',
        productRepo: 'jira-frontend',
        productCiPlanUrl: '',
        dockerContainer: 'docker.atl-paas.net/sox/jira/jira-frontend-agent:latest',
        packageEngine: 'yarn', 
        integratorCmd: 'upgrade',
        skipIntegrityCheck: true)
        
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

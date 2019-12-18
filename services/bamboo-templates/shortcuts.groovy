createBranchDeployIntegrator([
  'key',
  'productName',
  'repo'
]) {
    project(key:'ABDPI',name:'AFP - Branch Deploy Product Integrators',
      description:'Branch deploy all the things')
    repository(name:'Atlaskit-MK-2')
    repository(name:'#repo')
    trigger(type:'polling',enabled:'true',strategy:'periodically',
        frequency:'180') {
        repository(name:'Atlaskit-MK-2')
    }
    stage(name:'Default Stage') {
        job(key:'JOB1',name:'Default Job') {
            miscellaneousConfiguration() {
                pbc(enabled:'true',image:'docker.atl-paas.net/sox/confluence/confluence-frontend-agent:latest',
                size:'small')
            }
            task(type:'checkout',description:'Checkout Default Repository') {
                repository(name:'Atlaskit-MK-2')
            }
            task(type:'checkout',description:'Checkout #productName Repository') {
                repository(name:'#repo',checkoutDirectory:'product')
            }
            task(type:'script',description:'Install branch deploy',
                script:'services/branch-deploy-integrators-plan-template/integrate.sh',
                environmentVariables:'TEST=123', interpreter:'RUN_AS_EXECUTABLE')
    }
    }
}
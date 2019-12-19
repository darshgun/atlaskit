createBranchDeployIntegrator([
  'sourceRepo',
  'productRepo'
]) {
    project(key:'ABDPI',name:'AFP - Branch Deploy Product Integrators',
      description:'Branch deploy all the things')
    repository(name:'#sourceRepo')
    repository(name:'#productRepo')
    trigger(type:'polling',enabled:'true',strategy:'periodically',
        frequency:'180') {
        repository(name:'#sourceRepo')
    }
    stage(name:'Default Stage') {
        job(key:'JOB1',name:'Default Job') {
            miscellaneousConfiguration() {
                pbc(enabled:'true',image:'docker.atl-paas.net/sox/confluence/confluence-frontend-agent:latest',
                size:'small')
            }
            task(type:'checkout',description:'Checkout Default Repository') {
                repository(name:'#sourceRepo')
            }
            task(type:'checkout',description:'Checkout #productRepo Repository') {
                repository(name:'#productRepo',checkoutDirectory:'product')
            }
            task(type:'script',description:'Install branch deploy',
                script:'services/bamboo-templates/branch-deploy-integrator/install-branch-deploy.sh',
                environmentVariables:'TEST=123', interpreter:'RUN_AS_EXECUTABLE')
    }
    }
}